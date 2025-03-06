import request from "supertest";
import { app, server } from "./server.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import Availability from "./models/Availability.js";
import Appointment from "./models/Appointment.js";

describe("Complete Appointment System Flow", () => {
  let studentA1, studentA2, professorP1;
  let studentA1Token, studentA2Token, professorP1Token;
  let testDate = "2025-03-07";
  let timeT1 = "10:00 AM";
  let timeT2 = "11:00 AM";

  beforeAll(async () => {
    await User.deleteMany({});
    await Availability.deleteMany({});
    await Appointment.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("should register and authenticate Student A1", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "studentA1",
      password: "passwordA1",
      role: "student",
    });
    studentA1 = res.body.id;
    studentA1Token = res.body.token; // Store token
    expect(res.status).toBe(201);
  });

  it("should register and authenticate Professor P1", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "professorP1",
      password: "passwordP1",
      role: "professor",
    });
    professorP1 = res.body.id;
    professorP1Token = res.body.token; // Store token
    expect(res.status).toBe(201);
  });

  it("Professor P1 sets available time slots", async () => {
    const res = await request(app)
      .post("/api/availability")
      .send({
        professorId: professorP1,
        date: testDate,
        timeSlots: [
          { time: timeT1, booked: false },
          { time: timeT2, booked: false },
        ],
      });
    expect(res.status).toBe(200);
  });

  it("Student A1 views available time slots for Professor P1", async () => {
    const res = await request(app).get(
      `/api/availability/${professorP1}/${testDate}`
    );
    expect(res.status).toBe(200);
    expect(res.body.availableSlots.length).toBe(2);
  });

  let appointmentId; // Store the appointment ID globally

  it("Student A1 books an appointment with Professor P1 for time T1", async () => {
    const res = await request(app).post("/api/appointments").send({
      studentId: studentA1,
      professorId: professorP1,
      date: "2025-03-07",
      time: "10:00 AM",
    });

    console.log("Booking Response:", res.body); // Debugging log
    appointmentId = res.body.id; // Extract the appointment ID
    console.log("Checking status for Appointment ID:", appointmentId);
    expect(res.status).toBe(201);
  });

  it("should register and authenticate Student A2", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "studentA2",
      password: "passwordA2",
      role: "student",
    });
    studentA2 = res.body.id;
    studentA2Token = res.body.token; // Store token
    expect(res.status).toBe(201);
  });

  it("Student A2 books an appointment with Professor P1 for time T2", async () => {
    const res = await request(app).post("/api/appointments").send({
      studentId: studentA2,
      professorId: professorP1,
      date: testDate,
      time: timeT2,
    });
    expect(res.status).toBe(201);
  });

  it("Professor P1 cancels the appointment with Student A1", async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}`)
      .set("Authorization", `Bearer ${professorP1Token}`) // Include auth header
      .send();

    console.log("Cancellation Response:", res.body);
    expect(res.status).toBe(200);
  });

  it("Student A1 checks their appointments and sees no pending appointments", async () => {
    console.log("Checking status for Appointment ID:", appointmentId);

    const res = await request(app)
      .get(`/api/${appointmentId}/status`)
      .set("Authorization", `Bearer ${studentA1Token}`);

    console.log(
      "Student A1's Appointments after cancellation:",
      res.body.appointments
    );

    console.log("Student A1's Appointments Response:", res.body);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("cancelled");
  });
});
