import mongoose from "mongoose";

const CandidaturaSchema = new mongoose.Schema({
  utente: {
    nome: {
      type: String,
      required: true
    },
    cognome: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    dataNascita: {
      type: Date,
      required: true
    },
    cellulare: {
      type: String,
      required: true
    },
    codiceFiscale: {
      type: String,
      required: true
    }
  }
}, {
  collection: "candidature",
  timestamps: true
});

export default mongoose.models.candidature || mongoose.model("candidature", CandidaturaSchema);

