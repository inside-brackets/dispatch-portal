const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = "";
    let arr = req.url.split("/");
    let type = arr[arr.length - 2];
    path = `files/${type}`;
    cb(null, path);
  },
  filename: function (req, file, cb) {
    let arr = req.url.split("/");
    let id = arr[arr.length - 1];
    cb(null, Date.now() + "-" + id + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

module.exports = upload;
