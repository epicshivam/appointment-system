// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";

export const bookAppointment = async (req, res) => {
  try {
    const { studentId, professorId, date, time } = req.body;
    const appointment = new Appointment({ studentId, professorId, date, time });
    await appointment.save();
    res
      .status(201)
      .json({
        message: "Appointment booked successfully",
        id: appointment._id,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    await Appointment.findByIdAndUpdate(appointmentId, { status: "cancelled" });
    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const appointments = await Appointment.find({
      studentId,
      status: "booked",
    });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check appointment status
export const checkAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      appointmentId: appointment._id,
      studentId: appointment.studentId,
      professorId: appointment.professorId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status, // status can be "booked", "cancelled", etc.
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
