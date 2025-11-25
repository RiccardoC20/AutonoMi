import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Il testo è obbligatorio'],
    trim: true,
    minlength: [1, 'Il testo non può essere vuoto']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Word || mongoose.model('Word', wordSchema);

