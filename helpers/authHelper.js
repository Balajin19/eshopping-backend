const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (err) {
    next(err);
  }
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
