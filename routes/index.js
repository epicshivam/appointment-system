// routes/index.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  setAvailability,
  getAvailability,
} from "../controllers/availabilityController.js";
import {
  bookAppointment,
  cancelAppointment,
  getAppointmentsForStudent,
  checkAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Authentication Routes
router.post("/auth/register", register);
router.post("/auth/login", login);

// Availability Routes
router.post("/availability", setAvailability);
router.get("/availability/:professorId/:date", getAvailability);

// Appointment Routes
router.post("/appointments", bookAppointment);
router.put("/appointments/:appointmentId", cancelAppointment);
router.get("/appointments/:studentId", getAppointmentsForStudent);
router.get("/:appointmentId/status", checkAppointmentStatus);

export default router;
