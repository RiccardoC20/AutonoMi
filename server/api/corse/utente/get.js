import connectDB from "../../../utils/mongo";
import Corsa from "../../../models/corsa.model";
import useAuth from "../../../utils/useAuth";

export default defineEventHandler(async (event) => {
  try {
    // Verifica autenticazione JWT e ottiene il payload
    const { payload } = await useAuth(event);

    await connectDB();

    // Estrae codiceUtente dal payload del token JWT
    // Il codiceUtente può essere direttamente nel payload o nel campo user
    const codiceUtente = payload?.codiceUtente;
    
    if (!codiceUtente) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Codice utente non trovato nel token'
      });
    }

    // Cerca tutte le corse per questo codiceUtente
    const corse = await Corsa.find({ 
      codiceUtente: codiceUtente 
    })
    .sort({ data: 1 }) // Ordina per data di partenza (più recenti prima)
    .exec();

    console.log(`Trovate ${corse.length} corse per codiceUtente ${codiceUtente}`);

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
    console.error('Errore in get.js (corse/utente):', error);
    
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

