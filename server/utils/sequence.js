import mongoose from "mongoose";

// Schema per la sequenza auto-incrementale
const SequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
},{
    collection: "sequence"
});

const Sequence = mongoose.models.Sequence || mongoose.model("Sequence", SequenceSchema);

export async function getNextSequenceValue(sequenceName) {
  const sequence = await Sequence.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequence.seq++;
}

