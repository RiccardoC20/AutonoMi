import connectDB from "../../utils/mongo";
import Vettore from "../../models/vettore.model";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Recupera tutti i vettori dal database, ordinati per data di creazione (più recenti prima)
    const vettori = await Vettore.find({})
      .sort({ createdAt: -1 })
      .exec();

    return {
      success: true,
      data: vettori,
      count: vettori.length
    };
  } catch (error) {
    console.error('Errore in vettore.get.js:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nel recupero dei vettori'
    });
  }
});

