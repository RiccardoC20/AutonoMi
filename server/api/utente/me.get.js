import connectDB from "../../utils/mongo";
import Utente from "../../models/utente.model";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Ottiene il token dall'header Authorization
    const authHeader = getHeader(event, 'authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token non fornito'
      });
    }

    const token = authHeader.substring(7); // Rimuove "Bearer "
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    // Verifica e decodifica il token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token non valido o scaduto'
      });
    }

    // Cerca l'utente nel database usando l'ID dal token
    const utente = await Utente.findById(decoded.userId);

    if (!utente) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utente non trovato'
      });
    }

    // Restituisce i dati utente (senza password)
    return {
      success: true,
      user: {
        _id: utente._id,
        codiceUtente: utente.codiceUtente,
        nome: utente.nome,
        cognome: utente.cognome,
        email: utente.email,
        dataNascita: utente.dataNascita,
        cellulare: utente.cellulare
      }
    };
  } catch (error) {
    console.error('Errore in me.get.js:', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante la verifica del token'
    });
  }
});



