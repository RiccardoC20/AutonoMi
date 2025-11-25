import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Il Nome è obbligatorio'],
    trim: true,
    minlength: [1, 'Il Nome non può essere vuoto']
  },
  lastName: {
    type: String,
    required: [true, 'Il Cognome è obbligatorio'],
    trim: true,
    minlength: [1, 'Il Cognome non può essere vuoto']
  },
  birthDate: {
    type: Date,
    required: [true, 'La data di nascita è obbligatoria']
  },
  email: {
    type: String,
    required: [ true, 'L\'email è obbligatoria' ],
    unique: true,
    lowercase: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);

