const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("EndPoint Admin - Manajemen Member ", () => {
  it("Testing untuk Mengambil data Member", async () => {
    const members = await prisma.user.findMany({
      where: { role: "member", is_active: true },
    });
    //   };

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
