const speakeasy = require("speakeasy");

const generateOtp = () => {
  let token = speakeasy.totp({
    secret: process.env.OTP_KEY,
    encoding: "base32",
    digits: 6,
    step: 60,
    window: 5,
  });

  return token;
};
const verifyOtp = function verifyOtp(token) {
  let expiry = speakeasy.totp.verify({
    secret: process.env.OTP_KEY,
    encoding: "base32",
    token: token,
    step: 60,
    window: 5,
  });

  return expiry;
};
module.exports = { generateOtp, verifyOtp };
