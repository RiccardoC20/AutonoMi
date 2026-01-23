import connectDB from "../../../utils/mongo";
import Corsa from "../../../models/corsa.model";
import useAuth from "../../../utils/useAuth";

export default defineEventHandler(async (event) => {
  try {
    // Verifica autenticazione JWT e ottiene il payload
    const { payload } = await useAuth(event);

    await connectDB();

    // Estrae codiceVettore dal payload del token JWT
    const codiceVettore = payload?.codiceVettore;
    
    if (!codiceVettore) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Codice vettore non trovato nel token'
      });
    }

    // Cerca tutte le corse per questo codiceVettore
    const corse = await Corsa.find({ 
      codiceVettore: codiceVettore
    })
    .sort({ createdAt: -1 }) // Ordina per data di creazione (più recenti prima)
    .exec();

    console.log(`Trovate ${corse.length} corse per codiceVettore ${codiceVettore}`);

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
        effettuata: corsa.effettuata,
        createdAt: corsa.createdAt,
        updatedAt: corsa.updatedAt
      })),
      count: corse.length
    };
  } catch (error) {
    console.error('Errore in get.js (corse):', error);
    
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

