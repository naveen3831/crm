let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (e) {
  console.log("[Email Service] Standard require('nodemailer') failed, using native TLS fallback.");
}

const { sendNativeSmtpEmail } = require("./smtp-client");

const handleSendEmail = async (req, res, next) => {
  try {
    const { 
      type, // "PROPOSAL" | "INVOICE"
      clientEmail, 
      clientName, 
      companyName, 
      projectName, 
      proposalType, 
      proposalTier, 
      amount, 
      invoiceId, 
      proposalId,
      colorTheme,
      colorTheme2
    } = req.body;

    const user = (process.env.SMTP_USER || "naveenkumar970100@gmail.com").trim();
    const pass = (process.env.SMTP_PASS || "bzhrewmmaqzdnlrs").replace(/\s+/g, "");

    const recipient = (clientEmail && clientEmail.includes("@")) ? clientEmail.trim() : "naveenkumar970100@gmail.com";
    const safeClientName = clientName || "Valued Client";
    const safeCompany = companyName || "Client Business";
    const safeProject = projectName || "Web & Mobile Ecosystem";
    const safeAmount = Number(amount || 185000).toLocaleString("en-IN");
    const themeC1 = colorTheme || "#c2410c";
    const themeC2 = colorTheme2 || "#f97316";

    let subject = "";
    let htmlContent = "";

    if (type === "INVOICE") {
      subject = `Tax Invoice ${invoiceId || "INV-7001"} for ${safeProject} - ${safeCompany}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, ${themeC1}, ${themeC2}); padding: 30px; text-align: center; color: #ffffff; }
            .content { padding: 30px; }
            .badge { display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
            .card { background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #cbd5e1; }
            .amount { font-size: 28px; font-weight: 800; color: ${themeC1}; margin: 10px 0; }
            .button { display: inline-block; background: ${themeC1}; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 15px; }
            .footer { background: #0f172a; color: #94a3b8; padding: 20px; text-align: center; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="badge">Official Tax Invoice &bull; ${invoiceId || "INV-7001"}</span>
              <h1 style="margin: 10px 0 0 0; font-size: 22px;">Tax Invoice Issued for ${safeCompany}</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${safeClientName}</strong>,</p>
              <p>Please find attached the official Tax Invoice details for your project <strong>${safeProject}</strong>.</p>
              
              <div class="card">
                <div style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Total Billed Amount</div>
                <div class="amount">₹${safeAmount} INR</div>
                <div style="font-size: 12px; color: #475569;">
                  <strong>Invoice Reference:</strong> ${invoiceId || "INV-7001"}<br/>
                  <strong>Issued Date:</strong> ${new Date().toLocaleDateString()}<br/>
                  <strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">PAID & VERIFIED</span>
                </div>
              </div>

              <p>You can view and customize your full PDF tax invoice in the online invoice studio:</p>
              <a href="http://localhost:3000/admin/our-projects/OPRJ-6561/invoices/${invoiceId || "INV-7001"}" class="button">Open Live Invoice Studio</a>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Enterprise CRM System. Sent via Nodemailer Dispatcher.
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      // PROPOSAL
      subject = `Project Proposal & Quotation for ${safeProject} - ${safeCompany}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #0f172a, #ea580c); padding: 30px; text-align: center; color: #ffffff; }
            .content { padding: 30px; }
            .badge { display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
            .card { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0; }
            .price { font-size: 26px; font-weight: 800; color: #ea580c; margin: 10px 0; }
            .button { display: inline-block; background: #ea580c; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 15px; }
            .footer { background: #0f172a; color: #94a3b8; padding: 20px; text-align: center; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="badge">Official Proposal & Quotation Document</span>
              <h1 style="margin: 10px 0 0 0; font-size: 22px;">Project Proposal for ${safeCompany}</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${safeClientName}</strong>,</p>
              <p>We are excited to share the customized project proposal for <strong>${safeProject}</strong>.</p>
              
              <div class="card">
                <div style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Selected Proposal Model & Tier</div>
                <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 4px;">${proposalType || "Website + Mobile App Ecosystem"}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${proposalTier || "Plan B (Professional Recommended)"}</div>
                <div class="price">₹${safeAmount} INR</div>
              </div>

              <p>Review all 8 sections of your online interactive proposal (Scope, Deliverables, Architecture, Timeline, Terms):</p>
              <a href="http://localhost:3000/admin/our-projects/OPRJ-6561/proposals/${proposalId || "PROP-7001"}" class="button">Open Interactive 8-Section Proposal</a>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Enterprise CRM System. Sent via Nodemailer Dispatcher.
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Try Nodemailer first
    if (nodemailer) {
      try {
        console.log(`[Nodemailer Dispatch] Attempting Gmail dispatch to ${recipient} using ${user}...`);
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user, pass },
          tls: { rejectUnauthorized: false }
        });

        const info = await transporter.sendMail({
          from: `"CRM Admin" <${user}>`,
          to: recipient,
          subject: subject,
          html: htmlContent
        });

        console.log(`[Nodemailer SUCCESS] Sent ${type} to ${recipient}. MessageId: ${info.messageId}`);
        return res.status(200).json({
          success: true,
          message: `Email dispatched successfully to ${recipient} via Nodemailer`,
          type,
          recipient,
          subject,
          messageId: info.messageId
        });
      } catch (nmErr) {
        console.error("[Nodemailer Error, falling back to Native TLS]", nmErr.message);
      }
    }

    // Fallback to Native TLS Client
    try {
      console.log(`[Native TLS Fallback] Sending email to ${recipient}...`);
      const result = await sendNativeSmtpEmail({
        host: "smtp.gmail.com",
        port: 465,
        user: user,
        pass: pass,
        to: recipient,
        subject: subject,
        html: htmlContent
      });

      return res.status(200).json({
        success: true,
        message: `Email dispatched successfully to ${recipient} via Native TLS Client`,
        type,
        recipient,
        subject,
        messageId: result.messageId
      });
    } catch (sendErr) {
      console.error("[SMTP Send Error]", sendErr);
      return res.status(500).json({ success: false, error: sendErr.message || "Failed to deliver email" });
    }

  } catch (err) {
    console.error("[handleSendEmail Error]", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to dispatch email." });
  }
};

module.exports = {
  handleSendEmail
};
