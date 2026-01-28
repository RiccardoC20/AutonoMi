import connectDB from "../../../utils/mongo";
import RichiestaCorsa from "../../../models/richiestaCorsa.model";
import useAuth from "../../../utils/useAuth";

export default defineEventHandler(async (event) => {
  try {
    // Verifica autenticazione JWT
    const { payload } = await useAuth(event);
    
    await connectDB();

    // Estrae codiceUtente dal payload del token JWT
    const codiceUtente = payload?.codiceUtente;
    
    if (!codiceUtente) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Codice Utente non trovato nel token'
      });
    }

    // Cerca tutte le richieste di corsa per questo codiceUtente
    const richieste = await RichiestaCorsa.find({ 
      codiceUtente: codiceUtente 
    })
    .sort({ data: 1 }) // Ordina per data di creazione (più recenti prima)
    .exec();

    console.log(`Trovate ${richieste.length} richieste per codiceUtente ${codiceUtente}`);

    // Restituisce le richieste
    return {
      success: true,
      data: richieste.map(richiesta => ({
        _id: richiesta._id,
        codiceUtente: richiesta.codiceUtente,
        codiceVettore: richiesta.codiceVettore,
        partenza: richiesta.partenza,
        arrivo: richiesta.arrivo,
        data: richiesta.data,
        orario: richiesta.orario,
        km: richiesta.km
      })),
      count: richieste.length
    };
  } catch (error) {
    console.error('Errore in get.js (richieste-corsa):', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante il recupero delle richieste di corsa'
    });
  }
});

