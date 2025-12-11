import mongoose from "mongoose";

const UtenteSchema = new mongoose.Schema({
  codiceUtente: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
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
  },
  budget: {
    type: Number,
    required: true
  }
}, {
    collection: "utenti",
    timestamps: true
});


export default mongoose.models.utenti || mongoose.model("utenti", UtenteSchema);

