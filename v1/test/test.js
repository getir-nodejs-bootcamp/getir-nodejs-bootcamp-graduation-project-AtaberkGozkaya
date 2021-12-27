const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

describe("Missing Input Fields", () => {
  test("No Max Count", async () => {
    const response = await request(app).post("/records").send({
      startDate: "2016-01-26",
      endDate: "2018-02-02",
      minCount: 2700,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('"maxCount" is required');
  });
  test("No Min Count", async () => {
    const response = await request(app).post("/records").send({
      startDate: "2015-01-26",
      endDate: "2018-02-02",
      maxCount: 3000,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('"minCount" is required');
  });
  test("No startDate", async () => {
    const response = await request(app).post("/records").send({
      endDate: "2018-02-02",
      minCount: 2700,
      maxCount: 3000,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('"startDate" is required');
  });
  test("No endDate", async () => {
    const response = await request(app).post("/records").send({
      startDate: "2015-01-26",
      minCount: 2700,
      maxCount: 3000,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('"endDate" is required');
  });
});

describe("Invalid Date Formats", () => {
  test("Invalid startDate", async () => {
    const response = await request(app).post("/records").send({
      startDate: "26-01-2015",
      endDate: "2018-02-02",
      minCount: 2700,
      maxCount: 3000,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('"startDate" must be a valid date');
  });
  test("Invalid endDate", async () => {
    const response = await request(app).post("/records").send({
      startDate: "2016-01-26",
      endDate: "26-01-2017",
      minCount: 2700,
      maxCount: 3000,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('"endDate" must be a valid date');
  });
});

describe("Database Tests", () => {
  test("success test data", async () => {
    const response = await request(app).post("/records").send({
      startDate: "2015-06-06",
      endDate: "2018-01-26",
      minCount: 40,
      maxCount: 1000,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Success");
    expect(response.body.code).toBe(0);
  });
  test("Record Size Verification", async () => {
    const response1 = await request(app).post("/records").send({
      minCount: 99,
      maxCount: 1000,
      startDate: "2015-06-06",
      endDate: "2020-01-31",
    });
    const response2 = await request(app).post("/records").send({
      minCount: 99,
      maxCount: 1000,
      startDate: "2016-06-06",
      endDate: "2020-01-31",
    });
    expect(response1.statusCode).toBe(200);
    expect(response1.body.msg).toBe("Success");
    expect(response1.body.code).toBe(0);
    expect(response2.statusCode).toBe(200);
    expect(response2.body.msg).toBe("Success");
    expect(response2.body.code).toBe(0);
    expect(response1.body.records.length >= response2.body.records.length);
  });
  test("No Record since Date is Way Before", async () => {
    const response = await request(app).post("/records").send({
      startDate: "1990-01-26",
      endDate: "1993-01-26",
      minCount: 2700,
      maxCount: 3000,
    });
    expect(response.statusCode).toBe(500);
    expect(response.body.msg).toBe("No records found!");
    expect(response.body.code).toBe(1);
  });
  test("No Record since Date is Way Later", async () => {
    const response = await request(app).post("/records").send({
      minCount: 1000,
      maxCount: 10000,
      startDate: "2990-01-01",
      endDate: "2992-12-31",
    });
    expect(response.statusCode).toBe(500);
    expect(response.body.msg).toBe("No records found!");
    expect(response.body.code).toBe(1);
  });
  test("No Record with respect to count inputs", async () => {
    const response = await request(app).post("/records").send({
      startDate: "2014-01-26",
      endDate: "2018-01-26",
      minCount: 999,
      maxCount: 1000,
    });
    expect(response.statusCode).toBe(500);
    expect(response.body.msg).toBe("No records found!");
    expect(response.body.code).toBe(1);
  });
});

describe("Logical error testing", () => {
  test("startDate >= endDate(logical err)", async () => {
    const response = await request(app).post("/records").send({
      startDate: "2016-06-06",
      endDate: "2012-01-31",
      minCount: 99,
      maxCount: 100,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("startDate must be less or equal endDate");
  });
  test("minCount >= maxCount(logical err)", async () => {
    const response = await request(app).post("/records").send({
      startDate: "2016-06-06",
      endDate: "2020-01-31",
      minCount: 101,
      maxCount: 100,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("minCount must be less or equal maxCount");
  });
});

describe("Invalid paths", () => {
  test("records/data path does not exist", async () => {
    const response = await request(app).post("/records/data").send({
      startDate: "26-01-2015",
      endDate: "2018-02-02",
      minCount: 2700,
      maxCount: 3000,
    });
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Invalid url");
    expect(response.body.code).toBe(404);
  });
});
