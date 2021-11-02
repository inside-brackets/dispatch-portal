const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
var get_ip = require("ipware")().get_ip;

const { setIp, getIpList } = require("./util/ipList");

const salesRoutes = require("./routes/sales");
const rootRoutes = require("./routes/root");
const adminRoutes = require("./routes/admin");
const dispatchRoutes = require("./routes/dispatch");

const app = express();
const httpServer = createServer(app);

mongoose
  .connect(
    "mongodb://admin:9FzZrhjv5U9cWFP@cluster0-shard-00-00.fcfh0.mongodb.net:27017,cluster0-shard-00-01.fcfh0.mongodb.net:27017,cluster0-shard-00-02.fcfh0.mongodb.net:27017/dispatch_db?ssl=true&replicaSet=atlas-hj3cly-shard-0&authSource=admin&retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then((result) => {
    console.log("databse is connected");
  })
  .catch((err) => {
    throw err;
  });

// multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = "";
    if (req.url.includes("uploadfile")) {
      let arr = req.url.split("/");
      let type = arr[arr.length - 1];
      path = `files/${type}`;
    } else {
      path = `files/carrier_documents`;
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    let arr = req.url.split("/");
    let mc = arr[arr.length - 1];
    cb(null, Date.now() + "-" + mc + "-" + file.originalname);
  },
});

app.use(multer({ storage: storage }).array("file"));

// middlewares
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: "*",
  })
);

// sockets
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);
  var address = socket.handshake.address;
  console.log("New connection from " + address + ":" + address.port);
  socket.on("notify", (msg) => {
    console.log("notifyed");
    io.sockets.emit("backend-notify", msg);
  });
  socket.on("sale-closed", (msg) => {
    io.sockets.emit("sale-closed", msg);
  });
});

// redirecting
app.all("*", (req, res, next) => {
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  ip = ip.replace("::ffff:", "").trim();
  console.log("x-forwarded-for", ip);
  const ipList = getIpList();
  if (req.url.includes("whitelist")) {
    next();
  } else if (ipList.includes(ip)) {
    next();
  } else {
    io.sockets.emit("not-listed", "logout");
    res.status(401).send({
      message: "not white listed",
    });
  }
});
app.post("/whitelist/:mac/:ip", (req, res) => {
  setIp(req.params.mac, req.params.ip);
  console.log("ip list", getIpList());
  res.send("done");
});

app.get("/hello", (req, res) => {
  res.send("hello");
});
app.use("/sales", salesRoutes);
app.use("/admin", adminRoutes);
app.use("/dispatch", dispatchRoutes);
app.use("/", rootRoutes);

// staticly serving folders
app.use(
  "/files/carrier_documents",
  express.static(path.join(__dirname, "/files/carrier_documents"))
);
app.use(
  "/files/invoices",
  express.static(path.join(__dirname, "/files/invoices"))
);
app.use(
  "/files/ratecons",
  express.static(path.join(__dirname, "/files/ratecons"))
);

httpServer.listen(process.env.PORT || 8800, () =>
  console.log("Api is running")
);
