import mongoose from "mongoose";

const VettoreSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  mail: { type: String, required: true },
  numeroTelefono: { type: String, required: true },
  indirizzo: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.models.Vettore || mongoose.model("Vettore", VettoreSchema);
