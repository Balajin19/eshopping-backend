const { default: axios } = require("axios");

const sendEmail = async (to, subject, content) => {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.sendinblue.com/v3/smtp/email",
      headers: {
        "content-type": "application/json",
        "api-key":
          "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",
      },
      data: {
        sender: {
          name: "E-Shopping",
          email: process.env.ADMIN_EMAIL,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: content,
      },
    });
    console.log("Email sent successfully", response.data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
