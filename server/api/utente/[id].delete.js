import connectDB from "../../utils/mongo";
import Utente from "../../models/utente.model";
import { getSupabaseClient } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Ottiene l'ID dal parametro della route
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID utente non fornito'
      });
    }

    // Verifica che l'utente esista
    const utente = await Utente.findById(id);
    
    if (!utente) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utente non trovato'
      });
    }
    const codiceUtente = utente.codiceUtente
    const supabase = getSupabaseClient();
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET;
    const fileName = `${codiceUtente}.pdf`;
    const filePath = "utenti/" + fileName;

    console.log("codiceUtente " + codiceUtente)

    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (deleteError) {
      console.error('Errore eliminazione file PDF da Supabase:', deleteError);
      // Non blocchiamo l'eliminazione dell'utente se il file non esiste o c'è un errore
      // ma loggiamo l'errore per debug
    } else {
      console.log(`File PDF ${filePath} eliminato con successo da Supabase`);
    }

    // Elimina l'utente
    await Utente.findByIdAndDelete(id);

    return {
      success: true,
      message: 'Utente eliminato con successo'
    };
  } catch (error) {
    console.error('Errore in utente.delete.js:', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nell\'eliminazione dell\'utente'
    });
  }
});

