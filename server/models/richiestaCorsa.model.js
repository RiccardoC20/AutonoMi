import mongoose from "mongoose";

const RichiesteCorsaSchema = new mongoose.Schema({
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
  orario: {
    type: String,
    required: true
  }
}, {
  collection: "richieste_corse",
  timestamps: true
});

export default mongoose.models.richiesteCorsa || mongoose.model("richieste_corse", RichiesteCorsaSchema);

