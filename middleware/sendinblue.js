const { default: axios } = require("axios");
const mail = require("../helpers/mailContent");

const sendEmail = async ({ otp }) => {

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
          name: "E Shopping",
          email: "eshopping@gmail.com",
        },
        to: [{ email: "bn02149@gmail.com" }],
        subject:
          "E Shopping Account - your verification code for secure access",
        htmlContent: mail({ otp }),
      },
    });
    console.log("Email sent successfully", response.data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
