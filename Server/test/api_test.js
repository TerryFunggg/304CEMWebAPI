// const superagent = require("supertest");
// const app = require("../app");

// function request() {
//   return superagent(app.listen());
// }

// describe("Routes /", () => {
//   describe("GET /", () => {
//     it("should return 404", done => {
//       request()
//         .get("/")
//         .expect(404, done);
//     });
//   });

//   describe("POST /", () => {
//     it("should return 404", done => {
//       request()
//         .post("/")
//         .expect(404, done);
//     });
//   });

//   describe("PUT /", () => {
//     it("should return 404", done => {
//       request()
//         .put("/")
//         .expect(404, done);
//     });
//   });

//   describe("DELETE /", () => {
//     it("should return 404", done => {
//       request()
//         .delete("/")
//         .expect(404, done);
//     });
//   });
// });

// describe("Routes /api", () => {
//   describe("GET /api", () => {
//     it("should return 404", done => {
//       request()
//         .get("/api")
//         .expect(404, done);
//     });
//   });

//   describe("POST /api/", () => {
//     it("should return 404", done => {
//       request()
//         .post("/api")
//         .expect(404, done);
//     });
//   });

//   describe("PUT /api/", () => {
//     it("should return 404", done => {
//       request()
//         .put("/api")
//         .expect(404, done);
//     });
//   });

//   describe("DELETE /api/", () => {
//     it("should return 404", done => {
//       request()
//         .delete("/api")
//         .expect(404, done);
//     });
//   });
// });

// describe("Routes /api/login", () => {
//   describe("GET /api/login", () => {
//     it("should return 404", done => {
//       request()
//         .get("/api/login")
//         .expect(404, done);
//     });
//   });

//   describe("POST /api/login", () => {
//     it("should return 401", done => {
//       request()
//         .post("/api/login")
//         .send({ email: "john@gmail.com", password: "123456" })
//         .set("Accept", "application/json")
//         .expect(401, done);
//     });
//   });

//   describe("POST /api/login", () => {
//     it("should return 200", done => {
//       request()
//         .post("/api/login")
//         .send({ email: "json@gmail.com", password: "123456" })
//         .set("Accept", "application/json")
//         .expect(200, done);
//     });
//   });

//   describe("PUT /api/login", () => {
//     it("should return 404", done => {
//       request()
//         .put("/api/login")
//         .expect(404, done);
//     });
//   });

//   describe("DELETE /api/login", () => {
//     it("should return 404", done => {
//       request()
//         .delete("/api/login")
//         .expect(404, done);
//     });
//   });
// });
