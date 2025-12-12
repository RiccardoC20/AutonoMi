import mongoose from "mongoose";

const ComuneSchema = new mongoose.Schema({
  password: { type: String, required: true }
}, {
  collection: "comune"
});

export default mongoose.models.comune || mongoose.model("comune", ComuneSchema);
