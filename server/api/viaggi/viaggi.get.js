import { connectDB } from '../../utils/database.js';
import Viaggio from '../../models/Viaggio.js';

export default defineEventHandler(async (event) => {
  try {
    // Connessione al DB
    await connectDB();

    // Recupera tutti i viaggi ordinati per data della richiesta (più recenti prima)
    const viaggi = await Viaggio.find({})
      .sort({ richiestaAt: -1 })
      .exec();

    return {
      success: true,
      data: viaggi
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nel recupero dei viaggi'
    });
  }
});
