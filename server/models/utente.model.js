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
  }
}, {
    collection: "utente",
    timestamps: true
});


export default mongoose.models.utente || mongoose.model("utente", UtenteSchema);

