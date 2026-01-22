import connectDB from "../../utils/mongo";
import Utente from "../../models/utente.model";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Recupera tutti gli utenti dal database, ordinati per data di creazione asc
    const utenti = await Utente.find({})
      .sort({ createdAt: -1 })
      .exec();

    return {
      success: true,
      data: utenti,
      count: utenti.length
    };
  } catch (error) {
    console.error('Errore in utente.get.js:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nel recupero degli utenti'
    });
  }
});

