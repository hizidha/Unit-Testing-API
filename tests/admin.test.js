const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("EndPoint Admin - Manajemen Member ", () => {
  it("Testing untuk Mengambil data Member", async () => {
    const members = await prisma.user.findMany({
      where: { role: "member", is_active: true },
    });

    const response = await request(app).get("/admin").expect(200);
    expect(Object(response.body)).toBeTruthy();
  });

  it("Testing untuk Create Member", async () => {
    const newMemberData = {
      name: "Faris",
      username: "Faris",
      email: "Faris@gmail.com",
      password: "Faris",
      role: "member",
      is_active: true,
    };

    const existingMember = await prisma.user.findFirst({
      where: {
        OR: [
          { username: newMemberData.username },
          { email: newMemberData.email },
        ],
      },
    });

    if (existingMember) {
      const response = await request(app)
        .post("/admin")
        .send(newMemberData)
        .expect(400);
    } else {
      const response = await request(app)
        .post("/admin")
        .send(newMemberData)
        .expect(201);
    }
  });

  it("Testing untuk Update Member", async () => {
    // const adminController = new AdminController();
    const memberID = 3;
    const updateData = {
      name: "bagis",
      username: "bagis",
      email: "bagis@gmail.com",
      password: "bagis",
    };

    const existingMember = await prisma.user.findFirst({
      where: {
        OR: [{ username: updateData.username }, { email: updateData.email }],
      },
    });

    if (existingMember) {
      const response = await request(app)
        .post(`/member/${memberID}`)
        .send(updateData)
        .expect(404);
    } else {
      const response = await request(app)
        .put(`/member/${memberID}`)
        .send(updateData)
        .expect(200);
    }
  });

  it("Testing untuk Delete Member", async () => {
    const memberID = 3;
    const response = await request(app)
      .delete(`/member/${memberID}`)
      .expect(200);
  });
});

describe("EndPoint Admin - Manajemen Item", () => {
  it("Testing Mengambil semua data item", async () => {
    const items = await prisma.items.findMany();
    const response = await request(app).get("/admin/items").expect(200);
  });

  it("testing untuk mengambil data Items By Status", async () => {
    const status = "reject";

    if (status !== "onprocess" && status !== "approve" && status !== "reject") {
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

    const response = await request(app)
      .get(`/admin/items/${status}`)
      .expect(200);
  });

  it("Testing untuk Update Status Item", async () => {
    const id = 6;
    const status = "reject";
    let reason = "selamat pengajuanmu disetujui";

    let item = await prisma.items.findUnique({
      where: {
        id: id,
      },
    });

    if (item == id) {
      const response = await request(app)
        .patch(`/admin/items/${id}`)
        .send({ status, reason })
        .expect(200);
    }

    const update = await prisma.items.update({
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
    const response = await request(app)
      .patch(`/admin/items/${id}`)
      .send({ status, reason })
      .expect(400);
  });
});
