const prisma = require("../bin/prisma");

class MemberController {
  static async getProfile(req, res, next) {
    try {
      // const id = req.user.id;
      const data = await prisma.user.findUnique({
        where: {
          id: 4,
        },
      });

      return res.status(200).json({
        status: "200",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async getItems(req, res, next) {
    try {
      const items = await prisma.items.findMany({
        select: {
          user_id: true,
          name: true,
          category_id: true,
          url: true,
          quantity: true,
          price: true,
          total: true,
          status: true,
          duedate: true,
          history: {
            select: {
              reason: true,
            },
          },
        },
      });

      if (Object.keys(items).length === 0) {
        return res.status(200).json({
          status: "204",
          message: "You don't have any procurement item yet",
        });
      } else {
        return res.status(200).json({
          status: "200",
          data: items,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async getItemId(req, res, next) {
    try {
      // let { id } = req.params;

      // id = parseInt(id);

      // if (!id) {
      //   return res.status(400).json({
      //     status: "400",
      //     message: "ID params must be filled",
      //   });
      // }

      const item = await prisma.items.findUnique({
        where: {
          id: parseInt(1),
        },
      });

      if (!item) {
        return res.status(404).json({
          status: "404",
          message: "Item not found",
        });
      }

      // if (item.user_id !== req.user.id) {
      //   return res.status(403).json({
      //     status: "403",
      //     message: "You don't have accesss to this items",
      //   });
      // }

      return res.status(200).json({
        status: "200",
        data: item,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async getItemStatus(req, res, next) {
    try {
      // const { status } = req.params;
      const status = "onprocess";

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
          user_id: 4,
          status: status,
        },
      });

      if (Object.keys(items).length === 0) {
        return res.status(204).json({
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

  static async storeItem(req, res, next) {
    try {
      const { name, description, category_id, url, quantity, price, duedate } =
        req.body;

      if (
        !name ||
        !description ||
        !category_id ||
        !url ||
        !quantity ||
        !price ||
        !duedate
      ) {
        return res.status(400).json({
          status: "400",
          message: "All parameter must be filled!",
        });
      }

      const dueDateTime = new Date(duedate);
      const total = price * quantity;

      const item = await prisma.items.create({
        data: {
          user_id: 4,
          name: name,
          url: url,
          description: description,
          category_id: parseInt(category_id),
          quantity: quantity,
          price: price,
          total: total,
          duedate: dueDateTime,
        },
      });

      return res.status(201).json({
        status: "201",
        message: "Item has ben succesfully sent to admin",
        data: item,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}
module.exports = MemberController;
