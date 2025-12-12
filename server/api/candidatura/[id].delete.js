import connectDB from "../../utils/mongo";
import Candidatura from "../../models/candidatura.model";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    // Ottiene l'ID dal parametro della route
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID candidatura non fornito'
      });
    }

    // Verifica che la candidatura esista
    const candidatura = await Candidatura.findById(id);
    
    if (!candidatura) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Candidatura non trovata'
      });
    }
   
    // Elimina la candidatura
    await Candidatura.findByIdAndDelete(id);

    return {
      success: true,
      message: 'Candidatura eliminata con successo'
    };
  } catch (error) {
    console.error('Errore in candidature.delete.js:', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nell\'eliminazione della candidatura'
    });
  }
});

