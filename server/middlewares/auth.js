const { getIpList } = require("../util/ipList");

// check ip before request
const auth = async (req, res, next) => {
  if (process.env.SECURITY === "on") {
    var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    ip = ip.replace("::ffff:", "").trim();
    console.log("x-forwarded-for", ip);
    const ipList = getIpList();
    if (ipList.includes(ip)) {
      next();
    } else {
      res.status(401).send({
        message: "not white listed",
      });
    }
  } else {
    next();
  }
};

module.exports = auth;
