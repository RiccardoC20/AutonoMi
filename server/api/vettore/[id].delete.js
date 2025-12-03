import connectDB from "../../utils/mongo";
import Vettore from "../../models/vettore.model";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Ottiene l'ID dal parametro della route
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID vettore non fornito'
      });
    }

    // Verifica che il vettore esista
    const vettore = await Vettore.findById(id);
    
    if (!vettore) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Vettore non trovato'
      });
    }

    // Elimina il vettore
    await Vettore.findByIdAndDelete(id);

    return {
      success: true,
      message: 'Vettore eliminato con successo'
    };
  } catch (error) {
    console.error('Errore in vettore.delete.js:', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nell\'eliminazione del vettore'
    });
  }
});

