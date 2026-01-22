import mongoose from "mongoose";

const CorsaSchema = new mongoose.Schema({
  codiceUtente: {
    type: String,
    required: true
  },
  codiceVettore: {
    type: Number,
    required: true
  },
  partenza: {
    type: String,
    required: true
  },
  arrivo: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  effettuata: {
    type: Boolean,
    required: true
  }
}, {
  collection: "corse",
  timestamps: true
});

export default mongoose.models.corse || mongoose.model("corse", CorsaSchema);

