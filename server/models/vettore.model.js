import mongoose from "mongoose";

const VettoreSchema = new mongoose.Schema({
  codiceVettore: {
    type: Number,
    required: true,
    unique: true
  },
  nome: { type: String, required: true },
  email: { type: String, required: true },
  numeroTelefono: { type: String, required: true },
  sede: { type: String, required: true },
  password: { type: String, required: true },
}, {
  collection: "vettori",
  timestamps: true
});

export default mongoose.models.Vettore || mongoose.model("Vettore", VettoreSchema);
