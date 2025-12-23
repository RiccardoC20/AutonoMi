import mongoose from "mongoose";

const ComuneSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  }
}, {
  collection: "comune"
});

export default mongoose.models.comune || mongoose.model("comune", ComuneSchema);
