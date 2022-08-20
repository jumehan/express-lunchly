process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");

const db = require("./db");

let testCustomer;

/**Inserts TestCustomer into Database */
beforeEach(async function () {
  await db.query("DELETE FROM customers");
  let result = await db.query(`
  INSERT INTO customers (first_name, last_name, phone, notes)
  VALUES ('TestFirstName', 'TestLastName', 'TestPhone', 'TestNotes')
  RETURNING first_name, last_name, phone, notes`);
  testCustomer = result.rows[0];

});

afterAll(async function(){
  await db.end();
})

/** Tests GET request to "/" */
describe("GET /", function () {
  it("Gets a list of all customers", async function () {
    const resp = await request(app).get(`/`);

    expect(resp.text).toContain("TestFirstName");
    expect(resp.statusCode).toEqual(200);
    expect(resp.text).toContain("test customer list");
  });
});

/** Tests POST request to "/add" */
describe("POST /add/", function () {
  test("Creates a new customer", async function () {
    const testCustomer2 = {
      firstName : "TestFirstName2",
      lastName : "TestLastName2",
      phone : "TestPhone2",
      notes : "TestNotes2"}
    const resp = await request(app)
          .post("/add")
          .send(testCustomer2);
    console.log(resp)

    expect(resp.statusCode).toEqual(200);
    expect(resp.text).toContain("TestFirstName2");
    expect(resp.text).toContain("test customer detail");

    const results = await db.query("SELECT COUNT(*) FROM customers");
    expect(results.rows[0].count).toEqual("2");

  });
});


