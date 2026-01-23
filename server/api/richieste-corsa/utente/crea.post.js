import connectDB from "../../../utils/mongo";
import RichiestaCorsa from "../../../models/richiestaCorsa.model";
import useAuth from "../../../utils/useAuth";
import Utente from "../../../models/utente.model";

export default defineEventHandler(async (event) => {
  try {

    await connectDB();

    // Legge il body della richiesta
    const body = await readBody(event);
    const { codiceUtente, codiceVettore, partenza, arrivo, data, orario } = body;

    // Validazione campi obbligatori
    if (!codiceUtente || !codiceVettore || !partenza || !arrivo || !data || !orario) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tutti i campi sono obbligatori'
      });
    }

    // Genera un chilometraggio randomico (mock)
    const km = (Math.random() * 11 + 5).toFixed(1)

    // Controlla il budget dell'utente
    const utente = await Utente.findOne({codiceUtente});
    
    if (!utente) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utente non trovato'
      });
    } else if (utente.budget < km) {
      throw createError({
        statusMessage: 'Budget insufficiente per effettuare il viaggio'
      })
    }

    // Combina data e orario in un oggetto Date
    const dataCompleta = new Date(`${data}T${orario}`);

    // Crea la richiesta di corsa
    const richiestaCorsa = await RichiestaCorsa.create({
      codiceUtente,
      codiceVettore,
      partenza,
      arrivo,
      data: dataCompleta,
      km
    });

    console.log("Richiesta corsa creata con successo:", richiestaCorsa._id);

    // Restituisce la richiesta creata
    return {
      success: true,
      message: 'Richiesta di corsa creata con successo',
      richiestaCorsa: {
        _id: richiestaCorsa._id,
        codiceUtente: richiestaCorsa.codiceUtente,
        codiceVettore: richiestaCorsa.codiceVettore,
        partenza: richiestaCorsa.partenza,
        arrivo: richiestaCorsa.arrivo,
        data: richiestaCorsa.data,
        km: richiestaCorsa.km,
        createdAt: richiestaCorsa.createdAt
      }
    };
  } catch (error) {
    console.error('Errore in crea.post.js (richieste-corsa):', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante la creazione della richiesta di corsa'
    });
  }
});

