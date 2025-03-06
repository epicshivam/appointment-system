// models/Availability.js (Availability Model)
import mongoose from "mongoose";
const availabilitySchema = new mongoose.Schema(
  {
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    timeSlots: [{ time: String, booked: { type: Boolean, default: false } }],
  },
  { timestamps: true }
);

export default mongoose.model("Availability", availabilitySchema);
