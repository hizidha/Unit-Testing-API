require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
// const jwt = require("jsonwebtoken");
// const jwtkey = process.env.JWT_KEY;

const loginRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const memberRouter = require("./routes/member");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.json());

// async function verifyToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (token === undefined) {
//     return res.status(401).json({
//       status: "401",
//       message: "Access Denied! Unauthorized User",
//     });
//   } else {
//     jwt.verify(token, jwtkey, (err, authData) => {
//       if (err) {
//         res.status(401).json({
//           status: "401",
//           message: "Invalid Token...",
//         });
//       } else {
//         req.user = authData.user;
//         next();
//       }
//     });
//   }
// }

app.use("/", loginRouter);
app.use("/", adminRouter);
app.use("/", memberRouter);

module.exports = app;
