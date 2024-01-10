// require("dotenv").config();
const nodemailer = require("nodemailer");
const authEmail = process.env.AUTH_EMAIL;
const authPass = process.env.AUTH_PASSWORD;
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  // service: "gmail", // or your own SMTP
  auth: {
    user: "bn02149@gmail.com", // user -> important
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
  // clientId: process.env.OAUTH_CLIENT_ID,
  // clientSecret: process.env.OAUTH_CLIENT_SECRET,
  // refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  // accessToken: process.env.OAUTH_ACCESS_TOKEN,
  // expires: 3599,
});

transporter.verify((success, error) => {
  if (error) {
    console.log(error,"err123");
  } else {
    console.log(success,"success");
    console.log("Email Successfully sent!");
  }
});

// const sendMail = async (email, otp, expiresAt = 1) => {
const sendMail = async ( email, otp ) =>
{
    console.log(otp,"otp");
  try {
    const mailOptions = {
      from: "bn02149@gmail.com",
      to: "balajin1902@gmail.com",
      subject: "Forgot Password",
      text: `<p>Please use the below OTP to reset your password. This will be valid for ${expiresAt} hour only.</p>
            <h4>One Time Password(OTP):<span>${otp}</span></h4>
            <p>Regards,</p>
            <p>Shopping</p>`,
    };
    const mail = await transporter.sendMail(mailOptions);
    console.log(mail, "mail");
    return;
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMail;
