import connectDB from "../../../utils/mongo";
import Corsa from "../../../models/corsa.model";
import Utente from "../../../models/utente.model";


export default defineEventHandler(async (event) => {
  try {

    await connectDB();

    // Legge il body della richiesta
    const body = await readBody(event);
    const { codiceUtente, codiceVettore, partenza, arrivo, data, km} = body;

    // Validazione campi obbligatori
    if (!codiceUtente || !codiceVettore || !partenza || !arrivo || !data || !km) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tutti i campi sono obbligatori'
      });
    }

    // Controllo Budget

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
    

    // Scala budget

    const newBudget = utente.budget - km
    const updatedUser = await Utente.findOneAndUpdate(
      { codiceUtente: utente.codiceUtente },
      { $set: { budget: newBudget } },
      { new: true, upsert: true }
    );
    console.log("utente ", utente.codiceUtente, " modificato.\nBudget residuo ", newBudget)
    
    // Crea la corsa con effettuata = false
    const corsa = await Corsa.create({
      codiceUtente,
      codiceVettore,
      partenza,
      arrivo,
      data,
      km,
      effettuata: false
    });

    console.log("Corsa creata con successo:", corsa._id);

    // Restituisce la corsa creata
    return {
      success: true,
      message: 'Corsa creata con successo',
      corsa: {
        _id: corsa._id,
        codiceUtente: corsa.codiceUtente,
        codiceVettore: corsa.codiceVettore,
        partenza: corsa.partenza,
        arrivo: corsa.arrivo,
        data: corsa.data,
        km: corsa.km,
        effettuata: corsa.effettuata,
        createdAt: corsa.createdAt
      }
    };
  } catch (error) {
    console.error('Errore in crea.post.js (corse):', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante la creazione della corsa'
    });
  }
});

