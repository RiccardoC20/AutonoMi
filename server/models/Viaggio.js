import mongoose from 'mongoose';

const viaggioSchema = new mongoose.Schema({
  vettore: {
    type: String,
    required: [true, 'Il vettore è obbligatorio'],
    trim: true //elimina gli spazi all'inizio e alla fine del campo
  },
  nome: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    trim: true
  },
  cognome: {
    type: String,
    required: [true, 'Il cognome è obbligatorio'],
    trim: true
  },
  partenza: {
    type: String,
    required: [true, 'La partenza è obbligatoria'],
    trim: true
  },
  destinazione: {
    type: String,
    required: [true, 'La destinazione è obbligatoria'],
    trim: true
  },
  dataViaggio: {
    type: Date,
    required: [true, 'La data del viaggio è obbligatoria']
  },
  orarioPartenza: {
    type: String,
    required: [true, "L'orario di partenza è obbligatorio"],
    trim: true
  },
  richiestaAt: {
    type: Date,
    default: Date.now, // calcolo automatico
    immutable: true    // non può essere modificato dopo la creazione
  }
});

export default mongoose.models.Viaggio || mongoose.model('Viaggio', viaggioSchema);
