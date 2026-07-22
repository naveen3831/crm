const bcrypt = require("bcryptjs");
const User = require("./user.model");
const CRMRecord = require("../crm/crm.model");

// Seed default Admin & Customer users into DB ONLY if zero users exist in the database
const seedDefaultUsers = async () => {
  try {
    const totalUsers = await User.countDocuments();
    if (totalUsers > 0) return;

    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin Operator",
      email: "admin@crm.com",
      phone: "+91 99999 00000",
      company: "CRM Corp",
      password: hashedAdminPassword,
      role: "admin",
      status: "Active",
    });
    console.log("[Auth Seed] Seeded initial admin account: admin@crm.com");

    const hashedCustomerPassword = await bcrypt.hash("customer123", 10);
    await User.create({
      name: "John Doe",
      email: "customer@crm.com",
      phone: "+1 (555) 000-0000",
      company: "Acme Inc",
      password: hashedCustomerPassword,
      role: "customer",
      status: "Active",
    });
    console.log("[Auth Seed] Seeded initial customer account: customer@crm.com");
  } catch (err) {
    console.error("[Auth Seed Warning]", err.message);
  }
};

// 1. Register User (Stores data in DB, NO auto-login, Admin registration blocked)
exports.register = async (req, res, next) => {
  try {
    await seedDefaultUsers();

    const { name, email, phone, company, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Enforce @crm.com format requirement
    if (!normalizedEmail.endsWith("@crm.com")) {
      return res.status(400).json({
        success: false,
        message: "Email address must follow the @crm.com format (e.g. naveen@crm.com).",
      });
    }

    // Prevent registration of Admin accounts
    if (normalizedEmail === "admin@crm.com" || normalizedEmail.includes("admin")) {
      return res.status(400).json({
        success: false,
        message: "Admin accounts are pre-seeded and cannot be created through public registration.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists. Please sign in.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to User collection
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      phone: phone || "",
      company: company || "",
      password: hashedPassword,
      role: "customer",
      status: "Active",
    });

    // Also sync to CRMRecord collection so it appears in CRM admin dashboard
    const customId = `USR-${Math.floor(100 + Math.random() * 900)}`;
    await CRMRecord.create({
      type: "user",
      customId,
      data: {
        id: customId,
        name: newUser.name,
        email: newUser.email,
        role: "Client Access",
        status: "Active",
      },
    });

    // NOTE: Data is stored in the DB, but user is NOT automatically logged in!
    res.status(201).json({
      success: true,
      message: "Account registered successfully. Please log in with your credentials.",
    });
  } catch (error) {
    next(error);
  }
};

// 2. Login User (Verifies credentials against MongoDB database and detects DB role)
exports.login = async (req, res, next) => {
  try {
    await seedDefaultUsers();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Query database for user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User account '${normalizedEmail}' not found.`,
      });
    }

    // Check password (supports bcrypt hash compare or direct match for fallback)
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && (password === user.password)) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please check your credentials and try again.",
      });
    }

    // Login successful - return user data and DB role
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 3. Forgot Password Request
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your registered email address.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user account found with email '${normalizedEmail}'.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Account verified. Please enter your new password.",
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 4. Reset Password Action
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully. Please log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

exports.seedDefaultUsers = seedDefaultUsers;
