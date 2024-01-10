const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
       email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    otp: {
      type: String,
    },
    expiresAt:Date
  },
  { timestamps: true }
);

// UsersSchema.methods.isValidPassword = async function (password) {
//   try {
//     return password === this.password;
//   } catch (error) {
//     throw error;
//   }
// };
const OtpDetails = mongoose.model("otp-details", OtpSchema);
module.exports = OtpDetails;
