const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.isUser = async (req, res, next) => {
  if (req.path === "/login") {
    next();
  } else {
    let token = req.header("x-auth-token");
    if (!token) return res.status(400).send("Token Not Provided");
    try {
      let user = jwt.verify(token, process.env.JWT);
      let userObj = await User.findById(user._id);
      if (!userObj) {
        io.sockets.emit("logout", { userId: user._id });
      }
    } catch (error) {
      return res.status(401).send("Token Invalid");
    }
    next();
  }
};
