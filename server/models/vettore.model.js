import mongoose from "mongoose";

const vettoreSchema = new mongoose.Schema({
  codicevettore: {
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

export default mongoose.models.vettori || mongoose.model("vettori", vettoreSchema);
