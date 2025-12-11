import connectDB from "../../utils/mongo";
import Candidatura from "../../models/candidatura.model";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Recupera tutte le candidature dal database, ordinati per data di creazione (più recenti prima)
    const candidature = await Candidatura.find({})
      .sort({ createdAt: -1 })
      .exec();

    return {
      success: true,
      data: candidature,
      count: candidature.length
    };
  } catch (error) {
    console.error('Errore in candidature.get.js:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nel recupero delle candidature'
    });
  }
});

