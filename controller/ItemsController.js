const prisma = require("../bin/prisma");
const { hashSync, genSaltSync, compareSync, hash } = require("bcrypt");

class ItemsController {
  static async getAllItems(req, res, next) {
    try {
      const items = await prisma.items.findMany();
      if (Object.keys(items).length === 0) {
        return res.status(204).json({
          status: "204",
          message: "No item found",
        });
      }

      return res.status(200).json({
        status: "200",
        data: items,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async getItemStatus(req, res, next) {
    try {
      const { status } = req.params;
      if (
        status !== "onprocess" &&
        status !== "approve" &&
        status !== "reject"
      ) {
        return res.status(404).json({
          status: "404",
          message: "Only choose available status: onprocess, approve, reject",
        });
      }

      const items = await prisma.items.findMany({
        where: {
          status: status,
        },
      });

      if (Object.keys(items).length === 0) {
        return res.status(200).json({
          status: "204",
          message: "No items found with status " + status,
        });
      }

      return res.status(200).json({
        status: "200",
        data: items,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      let { id } = req.params;
      const { status } = req.body;
      let reason = req.body.reason;
      id = parseInt(id);

      if (
        status !== "onprocess" &&
        status !== "approve" &&
        status !== "reject"
      ) {
        return res.status(404).json({
          status: "404",
          message: "Only choose available status: onprocess, approve, reject",
        });
      }

      let item = await prisma.items.findUnique({
        where: {
          id: id,
        },
      });

      if (Object.keys(item).length === 0) {
        return res.status(200).json({
          status: "204",
          message: "No items found with status " + status,
        });
      }

      if (status === item.status) {
        return res.status(400).json({
          status: "400",
          message: "This item already has " + status + " status",
        });
      }

      item = await prisma.items.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });

      const history = await prisma.history.create({
        data: {
          items_id: id,
          reason: reason,
        },
      });
      console.log({ msg: "berhasil menambahkan histroy", history });

      return res.status(200).json({
        status: "200",
        message: "Succesfully change item status to " + status,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = ItemsController;
