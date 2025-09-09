import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  uid: { type: String, required: true } // UID del usuario de Firebase
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);