const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const { getIpList } = require("./util/ipList");

const salesRoutes = require("./routes/sales");
const rootRoutes = require("./routes/root");
const adminRoutes = require("./routes/admin");
const dispatchRoutes = require("./routes/dispatch");

const app = express();
const httpServer = createServer(app);

mongoose
  .connect(
    "mongodb+srv://admin:infamd124@cluster0.tpmok.mongodb.net/falcon-portal-db?retryWrites=true&w=majority",
    // "mongodb://admin:9FzZrhjv5U9cWFP@cluster0-shard-00-00.fcfh0.mongodb.net:27017,cluster0-shard-00-01.fcfh0.mongodb.net:27017,cluster0-shard-00-02.fcfh0.mongodb.net:27017/dispatch_db?ssl=true&replicaSet=atlas-hj3cly-shard-0&authSource=admin&retryWrites=true&w=majority",
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
  if (
    req.originalUrl.includes("whitelist") ||
    req.originalUrl.includes("myip")
  ) {
    next();
  } else if (ipList.includes(ip)) {
    next();
  } else {
    io.sockets.emit("not-listed", ip);
    res.status(401).send({
      message: "not white listed",
    });
  }
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
