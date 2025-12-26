import connectDB from "../../utils/mongo";
import RichiestaCorsa from "../../models/richiestaCorsa.model";
import useAuth from "../../utils/useAuth";

export default defineEventHandler(async (event) => {
  try {

    const { payload } = await useAuth(event);

    await connectDB();

    // Ottiene l'ID dal parametro della route
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID richiesta non fornito'
      });
    }

    // Verifica che la richiesta esista
    const richiesta = await RichiestaCorsa.findById(id);
    
    if (!richiesta) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Richiesta di corsa non trovata'
      });
    }

    // Verifica che la richiesta appartenga al vettore loggato
    const codiceVettore = payload?.codiceVettore;
    const codiceVettoreNum = typeof codiceVettore === 'number' 
      ? codiceVettore 
      : parseInt(codiceVettore, 10);

    if (richiesta.codiceVettore !== codiceVettoreNum) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Non hai i permessi per eliminare questa richiesta'
      });
    }

    // Elimina la richiesta dal database
    await RichiestaCorsa.findByIdAndDelete(id);

    console.log(`Richiesta corsa ${id} eliminata con successo`);

    return {
      success: true,
      message: 'Richiesta di corsa eliminata con successo'
    };
  } catch (error) {
    console.error('Errore in [id].delete.js (richieste-corsa):', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nell\'eliminazione della richiesta di corsa'
    });
  }
});

