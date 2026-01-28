import connectDB from "../../../utils/mongo";
import Corsa from "../../../models/corsa.model";
import useAuth from "../../../utils/useAuth";

export default defineEventHandler(async (event) => {
  try {
    // Verifica autenticazione JWT e ottiene il payload
    const { payload } = await useAuth(event);

    await connectDB();

    // Cerca tutte le corse per questo codiceUtente
    const corse = await Corsa.find( {} )
    .sort({ data: 1 }) // Ordina per data di creazione (più recenti prima)
    .exec();

    // Restituisce le corse
    return {
      success: true,
      data: corse.map(corsa => ({
        _id: corsa._id,
        codiceUtente: corsa.codiceUtente,
        codiceVettore: corsa.codiceVettore,
        partenza: corsa.partenza,
        arrivo: corsa.arrivo,
        data: corsa.data,
        km: corsa.km,
        effettuata: corsa.effettuata,
      })),
      count: corse.length
    };
  } catch (error) {
    console.error('Errore in get.js (corse/comune):', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante il recupero delle corse'
    });
  }
});

