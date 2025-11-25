import { connectDB } from '../../utils/database.js';
import Word from '../../models/Word.js';

export default defineEventHandler(async (event) => {
  try {
    // Connessione al database
    await connectDB();

    // Recupera tutte le parole ordinate per data di creazione (più recenti prima)
    const words = await Word.find({})
      .sort({ createdAt: -1 })
      .exec();

    return {
      success: true,
      data: words
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nel recupero delle parole'
    });
  }
});

