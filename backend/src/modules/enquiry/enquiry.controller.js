const Enquiry = require("./enquiry.model");

// @desc    Create a new contact enquiry
// @route   POST /api/v1/enquiries
// @access  Public
exports.createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message, consent } = req.body;

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      company,
      subject,
      message,
      consent,
    });

    res.status(201).json({
      success: true,
      message: "Your enquiry was received successfully.",
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve all enquiries (Admin usage)
// @route   GET /api/v1/enquiries
// @access  Private (Admin Role Verification is configured in later phases)
exports.getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve individual enquiry by ID
// @route   GET /api/v1/enquiries/:id
// @access  Private
exports.getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: `Enquiry not found with ID ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status/notes
// @route   PUT /api/v1/enquiries/:id
// @access  Private
exports.updateEnquiry = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    let enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: `Enquiry not found with ID ${req.params.id}`,
      });
    }

    enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully.",
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};
