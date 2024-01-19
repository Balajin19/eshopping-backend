const { default: axios } = require("axios");

const sendEmail = async (to, subject, content) => {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.sendinblue.com/v3/smtp/email",
      headers: {
        "content-type": "application/json",
        "api-key": process.env.SEND_IN_BLUE_API_KEY,
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
    console.error( "Error sending email:", error );
    
  }
};

module.exports = sendEmail;
