import request from "supertest";
import { app, server } from "../server.js"; // Ensure correct path
import mongoose from "mongoose";
import User from "../models/User.js";
import Availability from "../models/Availability.js"; // Import Availability Model

describe("Availability API Tests", () => {
  let professorId;
  let testDate = "2025-03-07";
  let testTimeSlots = [
    { time: "10:00 AM", booked: false },
    { time: "11:00 AM", booked: false },
  ];

  beforeAll(async () => {
    // Clean test database
    await User.deleteMany({});
    await Availability.deleteMany({});

    // Register a professor and get ID
    const res = await request(app).post("/api/auth/register").send({
      username: "professor1",
      password: "securepass",
      role: "professor",
    });

    professorId = res.body.id; // Assuming response contains user ID
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("should set availability for a professor", async () => {
    const res = await request(app)
      .post("/api/availability")
      .send({ professorId, date: testDate, timeSlots: testTimeSlots });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Availability updated successfully"
    );
  });

  it("should retrieve availability for a professor on a given date", async () => {
    const res = await request(app).get(
      `/api/availability/${professorId}/${testDate}`
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("availableSlots");
    expect(res.body.availableSlots.length).toBe(2);
  });

  it("should return 404 if no availability is found", async () => {
    const res = await request(app).get(
      `/api/availability/${professorId}/2025-03-08`
    );
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "No availability found");
  });

  it("should update availability if it already exists", async () => {
    let updatedSlots = [{ time: "12:00 PM", booked: false }];

    const res = await request(app)
      .post("/api/availability")
      .send({ professorId, date: testDate, timeSlots: updatedSlots });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Availability updated successfully"
    );

    const checkRes = await request(app).get(
      `/api/availability/${professorId}/${testDate}`
    );
    expect(checkRes.body.availableSlots.length).toBe(1);
    expect(checkRes.body.availableSlots[0].time).toBe("12:00 PM");
  });
});
