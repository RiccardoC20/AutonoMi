import connectDB from "../../../utils/mongo";
import RichiestaCorsa from "../../../models/richiestaCorsa.model";
import useAuth from "../../../utils/useAuth";

export default defineEventHandler(async (event) => {
  try {
    // Verifica autenticazione JWT
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
    
    // Cerca tutte le richieste di corsa per questo codiceVettore
    const richieste = await RichiestaCorsa.find({ 
      codiceVettore: codiceVettore 
    })
    .sort({ data: 1 }) // Ordina per data di creazione (più recenti prima)
    .exec();

    console.log(`Trovate ${richieste.length} richieste per codiceVettore ${codiceVettore}`);

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

