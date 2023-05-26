const prisma = require("../bin/prisma");
const { hashSync, genSaltSync, compareSync, hash } = require("bcrypt");

class AdminController {
  static async getMembers(req, res, next) {
    try {
      if (req.user.role != "admin") {
        return res.status(403).json({
          status: "403",
          message: "Access Denied! Access admin only",
        });
      }
      const member = await prisma.user.findMany({
        where: {
          role: "member",
          is_active: true,
        },
      });

      if (Object.keys(member).length === 0) {
        return res.status(200).json({
          status: "204",
          message: "No member found",
        });
      } else {
        return res.status(200).json({
          status: "200",
          data: member,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  static async storeMember(req, res, next) {
    try {
      if (req.user.role != "admin") {
        return res.status(403).json({
          status: "403",
          message: "Access Denied! Access admin only",
        });
      }
      const { name, username, email, password } = req.body;
      if (!name || !username || !email || !password) {
        return res.status(400).json({
          status: "400",
          message: "All parameter must be filled!",
        });
      }

      const checkUsername = await prisma.user.findFirst({
        where: {
          username: username,
          is_active: true,
        },
      });

      const checkEmail = await prisma.user.findFirst({
        where: {
          email: email,
          is_active: true,
        },
      });

      if (checkUsername) {
        return res.status(400).json({
          status: "400",
          message: "Username has been taken",
        });
      }

      if (checkEmail) {
        return res.status(400).json({
          status: "400",
          message: "Email has been taken",
        });
      }

      const salt = genSaltSync(10);

      const member = await prisma.user.create({
        data: {
          name: name,
          email: email,
          username: username,
          password: hashSync(password, salt),
        },
      });
      console.log(member);

      return res.status(201).json({
        status: 200,
        message: "Member account succesfully created",
        data: {
          name: member.name,
          email: member.email,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msh: "Username/email has been taken" });
    }
  }

  static async updateMember(req, res, next) {
    try {
      if (req.user.role != "admin") {
        return res.status(403).json({
          status: "403",
          message: "Access Denied! Access admin only",
        });
      }
      const { name, email, username, password } = req.body;
      let { id } = req.params;
      if (!id || !name || !username || !email || !password) {
        return res.status(400).json({
          status: "400",
          message: "All parameter must be filled!",
        });
      }

      id = parseInt(id);

      const member = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!member) {
        return res.status(404).json({
          status: "404",
          message: "Member with id " + id + " not found",
        });
      }

      const checkUsername = await prisma.user.findFirst({
        where: {
          username: username,
          is_active: true,
        },
      });

      const checkEmail = await prisma.user.findFirst({
        where: {
          email: email,
          is_active: true,
        },
      });

      if (checkEmail || checkUsername) {
        return res.status(200).json({
          status: "200",
          message: "Username/email has been taken",
        });
      }

      const salt = genSaltSync(10);
      const updatedMember = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          username: username,
          email: email,
          password: hashSync(password, salt),
        },
      });

      return res.status(200).json({
        status: "201",
        message: "Member account has succesfully updated",
        data: updatedMember,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async deleteMember(req, res, next) {
    try {
      if (req.user.role != "admin") {
        return res.status(403).json({
          status: "403",
          message: "Access Denied! Access admin only",
        });
      }
      let { id } = req.params;
      id = parseInt(id);

      const member = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!member) {
        return res.status(404).json({
          status: "404",
          message: "Member with id " + id + " not found",
        });
      }

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          is_active: false,
        },
      });

      return res.status(200).json({
        status: "200",
        message: "Member account has succesfully deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = AdminController;
