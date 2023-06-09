const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("EndPoint Member - Manajement Items", () => {
  it("Testing untuk Mengambil data profile", async () => {
    const member = await prisma.user.findUnique({
      where: {
        id: 4,
      },
    });

    const response = await request(app).get("/member/profile").expect(200);
  });

  it("Testing untuk Create data Item", async () => {
    const price = 2000;
    const quantity = 5;
    const total = price * quantity;
    const newItemData = {
      user_id: 4,
      name: "Lenovo Legion",
      url: "tokopedoa.com/motorCB150X",
      description: "pengajuan Komputer Kantor",
      category_id: 1,
      quantity: quantity,
      price: price,
      total: total,
      duedate: "2020-08-02",
    };
    const response = await request(app)
      .post("/member/items")
      .send(newItemData)
      .expect(201);
  });

  it("Testing untuk mengambil data Items", async () => {
    const items = await prisma.items.findMany({
      where: {
        user_id: 4,
      },
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

    const response = await request(app).get("/member/items").expect(200);
  });

  it("Testing untuk mengambil data Items By Id", async () => {
    const itemsId = 100;

    const item = await prisma.items.findUnique({
      where: {
        id: itemsId,
      },
    });

    if (item == itemsId) {
      const response = await request(app)
        .get(`/member/items/${itemsId}`)
        .expect(200);
    } else {
      const response = await request(app)
        .get(`/member/items/${itemsId}`)
        .expect(200);
    }
  });

  it("testing untuk mengambil data Items By Status", async () => {
    const status = "approve";

    if (status !== "onprocess" && status !== "approve" && status !== "reject") {
      const response = await request(app)
        .get(`/member/items/${status}`)
        .expect(404);
    }

    const items = await prisma.items.findMany({
      where: {
        user_id: 4,
        status: status,
      },
    });
    if (items === "onprocess") {
      const response = await request(app)
        .get(`/member/items/${status}`)
        .expect(200);
    } else if (items === "approve") {
      const response = await request(app)
        .get(`/member/items/${status}`)
        .expect(200);
    } else if (items === "reject") {
      const response = await request(app)
        .get(`/member/items/${status}`)
        .expect(200);
    } else {
      const response = await request(app)
        .get(`/member/items/${status}`)
        .expect(200);
    }
  });
});
