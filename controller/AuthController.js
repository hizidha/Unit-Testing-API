const express = require("express");
const AuthRouter = express.Router();

const jwt = require("jsonwebtoken");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const cookieParser = require("cookie-parser");
const prisma = require("../bin/prisma");
const jwtkey = process.env.JWT_KEY;

AuthRouter.use(cookieParser());

class AuthController {
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          status: "400",
          message: "Username and password must be filled!",
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          AND: [
            {
              username: {
                equals: username,
              },
            },
            {
              is_active: {
                equals: true,
              },
            },
          ],
        },
      });

      if (!user || !compareSync(password, user.password)) {
        return res.status(404).json({
          status: "404",
          message: "Your account has been deactivated",
        });
      } else if (!user || !compareSync(password, user.password)) {
        return res.status(404).json({
          status: "401",
          message: "Invalid username or password",
        });
      } else {
        const token = jwt.sign(
          {
            user: user,
          },
          jwtkey,
          {
            expiresIn: "30m",
          }
        );
        console.log(token);
        return res.status(200).json({
          status: "200",
          name: user.name,
          message: "Succesfully login",
          token: token,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}

module.exports = AuthController;
