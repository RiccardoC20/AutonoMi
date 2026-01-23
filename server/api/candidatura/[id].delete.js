import connectDB from "../../utils/mongo";
import Candidatura from "../../models/candidatura.model";
import { getSupabaseClient } from "../../utils/supabase";
import { sendMail } from "../../utils/email";

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

    // Ottiene il parametro query per distinguere rifiuto/accettazione
    const query = getQuery(event);
    const action = query.action; // 'accept' o 'reject' (default: 'reject')

    // Verifica che la candidatura esista
    const candidatura = await Candidatura.findById(id);
    
    if (!candidatura) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Candidatura non trovata'
      });
    }

    // Salva i dati dell'utente per la'email prim di eliminare la candidatura
    const emailUtente = candidatura.utente?.email;
    const nomeUtente = candidatura.utente?.nome;

    // Elimina il file PDF da Supabase SOLO se la candidatura viene rifiutata
    if (action !== 'accept') {
      try {
        const codiceFiscale = candidatura.utente?.codiceFiscale;
        
        if (codiceFiscale) {
          const supabase = getSupabaseClient();
          const bucketName = process.env.SUPABASE_STORAGE_BUCKET;
          const fileName = `${codiceFiscale}.pdf`;
          const filePath = "candidature/" + fileName;
          
          const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);
          
          if (deleteError) {
            console.error('Errore eliminazione file PDF da Supabase:', deleteError);
            // Non blocchiamo l'eliminazione della candidatura se il file non esiste o c'è un errore
            // ma loggiamo l'errore per debug
          } else {
            console.log(`File PDF ${fileName} eliminato con successo da Supabase`);
          }
        }
      } catch (supabaseError) {
        console.error('Errore durante l\'eliminazione del PDF da Supabase:', supabaseError);
        // Non blocchiamo l'eliminazione della candidatura se c'è un errore con Supabase
      }
    } else {
      console.log('Candidatura accettata: il PDF non viene eliminato da Supabase');
    }
   
    // Elimina la candidatura dal database MongoDB
    await Candidatura.findByIdAndDelete(id);

    // Invia email di notifica rifiuto all'utente SOLO se la candidatura è stata rifiutata
    if (action !== 'accept' && emailUtente && nomeUtente) {
      const testoEmail = `
Gentile ${nomeUtente},

La informiamo che la tua candidatura per AutonoMi è stata rifiutata.

Ci dispiace comunicarle questa decisione. Se desidera maggiori informazioni, può contattarci.

Cordiali saluti,
Team AutonoMi
      `;
      
      sendMail(emailUtente, 'Candidatura rifiutata - AutonoMi', testoEmail)
        .catch(err => {
          console.error('Errore nell\'invio email di rifiuto (non critico):', err);
          // Non blocchiamo l'eliminazione se l'email fallisce
        });
    }
    
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

