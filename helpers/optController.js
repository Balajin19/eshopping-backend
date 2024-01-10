// const otpGenerator = require("otp-generator");
const speakeasy = require("speakeasy");

const generateOtp = () => {
  let token = speakeasy.totp({
    secret: process.env.OTP_KEY,
    encoding: "base32",
    digits: 6,
    step: 30,
    window: 1,
  });

  return token;
};
const verifyOtp = function verifyOtp(token) {

  let expiry = speakeasy.totp.verify({
    secret: process.env.OTP_KEY,
    encoding: "base32",
    token: token,
    step: 30,
    window: 1,
  });

  return expiry;
};
module.exports = { generateOtp, verifyOtp };
