const jwt = require("jsonwebtoken");

const getToken = (token) => {
  let user = jwt.verify(token, process.env.JWT);
  console.log('user',user)
  return user._id;
};
module.exports = {
  getToken,
};
