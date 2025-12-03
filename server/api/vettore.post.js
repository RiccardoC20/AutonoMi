import connectDB from "../utils/mongo";
import Vettore from "../models/vettore.model";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Legge il body della richiesta (gestisce automaticamente JSON e FormData)
    const body = await readBody(event);

    // Estrae i campi (gestisce sia oggetti che FormData)
    const nome = body.nome;
    const mail = body.mail;
    const numeroTelefono = body.numeroTelefono;
    const indirizzo = body.indirizzo;

    // Validazione: tutti i campi sono obbligatori
    if (!nome || !mail || !numeroTelefono || !indirizzo) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tutti i campi sono obbligatori: nome, mail, numeroTelefono, indirizzo'
      });
    }

    const vettore = await Vettore.create({
      nome,
      mail,
      numeroTelefono,
      indirizzo,
    });

    return vettore;
  } catch (error) {
    console.error('Errore in vettore.post.js:', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nel salvataggio del vettore'
    });
  }
});
