const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoose = require("mongoose");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const salesRoutes = require("./routes/sales");
const rootRoutes = require("./routes/root");
const adminRoutes = require("./routes/admin");
const dispatchRoutes = require("./routes/dispatch");

const app = express();
const httpServer = createServer(app);

dotenv.config();

mongoose
  .connect(
    process.env.PROD === "true"
      ? process.env.FALCON_DB
      : process.env.FALCON_DB_TEST,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then((result) => {
    console.log(
      process.env.PROD === "true"
        ? "Real database connected"
        : "Test database connected"
    );
  })
  .catch((err) => {
    throw err;
  });

app.use(
  cors({
    origin: "*",
  })
);

// middlewares
app.use(express.json({ limit: "5mb", extended: true }));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

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

// check
app.use(async (req, res, next) => {
  if (req.path === "/login") {
    next();
  } else {
    let token = req.header("x-auth-token");
    if (!token) return res.status(400).send("Token Not Provided");
    try {
      let user = jwt.verify(token, process.env.JWT);
      let userObj = await User.findById(user._id);
      if (!userObj) {
        io.sockets.emit("logout", { message: "Abcd" });
      }
    } catch (error) {
      return res.status(401).send("Token Invalid");
    }
    next();
  }
});
app.use("/sales", salesRoutes);
app.use("/admin", adminRoutes);
app.use("/dispatch", dispatchRoutes);
app.get("/hello", (req, res) => {
  res.status(200).send({ msg: "hello" });
});
app.use("/", rootRoutes);

httpServer.listen(process.env.PORT || 8800, () =>
  console.log("Api is running")
);
