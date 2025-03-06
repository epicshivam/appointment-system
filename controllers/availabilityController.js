// controllers/availabilityController.js
import Availability from "../models/Availability.js";

export const setAvailability = async (req, res) => {
  try {
    const { professorId, date, timeSlots } = req.body;
    let availability = await Availability.findOne({ professorId, date });
    if (!availability) {
      availability = new Availability({ professorId, date, timeSlots });
    } else {
      availability.timeSlots = timeSlots;
    }
    await availability.save();
    res.status(200).json({ message: "Availability updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const { professorId, date } = req.params;
    const availability = await Availability.findOne({ professorId, date });
    if (!availability)
      return res.status(404).json({ message: "No availability found" });
    res.status(200).json({ availableSlots: availability.timeSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
