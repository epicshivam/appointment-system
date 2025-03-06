import request from "supertest";
import { app, server } from "../server.js"; // Ensure correct relative path
import mongoose from "mongoose";
import User from "../models/User.js"; // Import the User model

describe("Auth API Tests", () => {
  let testUser = {
    username: "testuser",
    password: "testpassword",
    role: "student",
  };

  beforeEach(async () => {
    await User.deleteOne({ username: testUser.username });
  });

  afterEach(async () => {
    // Cleanup: Remove the test user from the database after each test
    await User.deleteOne({ username: testUser.username });
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.status).toBe(201); // Adjust based on your API response
    expect(res.body).toHaveProperty("message"); // Ensure response contains a message
  });

  it("should login with correct credentials and return user ID", async () => {
    // First, register the user so we can test login
    await request(app).post("/api/auth/register").send(testUser);

    const res = await request(app).post("/api/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id"); // Expect "id" instead of "userId"
  });

  it("should return error for invalid login credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "wronguser",
      password: "wrongpassword",
    });
    expect(res.status).toBe(400); // Expect "400" instead of "401"
    expect(res.body).toHaveProperty("error");
  });
});

// Cleanup after all tests are done
afterAll(async () => {
  await mongoose.connection.close(); // Close DB connection
  server.close(); // Close Express server
});
