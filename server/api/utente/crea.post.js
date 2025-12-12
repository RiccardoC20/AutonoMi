import connectDB from "../../utils/mongo";
import Utente from "../../models/utente.model";
import { getNextSequenceValue } from "../../utils/sequence";
import { generateRandomPassword } from "../../utils/password";
import { sendMail } from "../../utils/email";
import { getSupabaseClient } from "../../utils/supabase";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Legge il body della richiesta
    const body = await readBody(event);

    // Estrae i campi
    const nome = body.nome;
    const cognome = body.cognome;
    const email = body.email;
    const dataNascita = body.dataNascita;
    const cellulare = body.cellulare;
    const codiceFiscale = body.codiceFiscale;
    const budget = 200; // Budget di default a 200 se non specificato
    const pdfUrl = body.pdfUrl; // URL del PDF dalla candidatura (opzionale)

    // Validazione: tutti i campi sono obbligatori (tranne budget e pdfUrl)
    if (!nome || !cognome || !email || !dataNascita || !cellulare || !codiceFiscale) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tutti i campi sono obbligatori: nome, cognome, email, dataNascita, cellulare, codiceFiscale'
      });
    }

    // Verifica se l'utente esiste già (per email o codice fiscale)
    const utenteEsistente = await Utente.findOne({
      $or: [
        { email: email },
        { codiceFiscale: codiceFiscale }
      ]
    });

    if (utenteEsistente) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Un utente con questa email o codice fiscale esiste già'
      });
    }

    // Ottiene il prossimo codice utente incrementale
    const codiceUtente = await getNextSequenceValue('utenti');

    // Genera password temporanea randomica di 8 caratteri
    const passwordPlain = generateRandomPassword(8);

    // Hasha la password con bcrypt
    const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10);
    const passwordHash = await bcrypt.hash(passwordPlain, rounds);

    // Converte dataNascita in Date se è una stringa
    const dataNascitaDate = typeof dataNascita === 'string' ? new Date(dataNascita) : dataNascita;

    // Sposta e rinomina il file PDF da /candidature/codiceFiscale.pdf a /utenti/codiceUtente.pdf
    let nuovoPdfUrl = pdfUrl || '';
    
    if (pdfUrl) {
      try {
        const supabase = getSupabaseClient();
        const bucketName = process.env.SUPABASE_STORAGE_BUCKET;
        const fromPath = `candidature/${codiceFiscale}.pdf`;
        const toPath = `utenti/${codiceUtente}.pdf`;

        // Copia il file dalla posizione originale alla nuova posizione
        const { data: copyData, error: copyError } = await supabase.storage
          .from(bucketName)
          .copy(fromPath, toPath);

        if (!copyError) {
          // Elimina il file dalla posizione originale
          await supabase.storage
            .from(bucketName)
            .remove([fromPath]);

          // Genera URL firmato per il nuovo file
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(toPath, 31622400); // 366 giorni (s)

          if (!signedUrlError && signedUrlData) {
            nuovoPdfUrl = signedUrlData.signedUrl;
          } else {
            console.error('Errore generazione URL firmato:', signedUrlError);
          }
        } else {
          console.error('Errore copia file su Supabase:', copyError);
        }
      } catch (supabaseError) {
        console.error('Errore durante lo spostamento del PDF su Supabase:', supabaseError);
        // Non blocchiamo la creazione dell'utente se lo spostamento fallisce
      }
    }
    
    // Crea l'utente in mongoDb
    await Utente.create({
      codiceUtente,
      nome,
      cognome,
      email,
      dataNascita: dataNascitaDate,
      cellulare,
      codiceFiscale,
      budget,
      password: passwordHash,
      pdfUrl: nuovoPdfUrl, // Usa il nuovo URL dopo lo spostamento
    });
    
    // Invia email con le credenziali (in background, non blocca la risposta)   
    const testoEmail = `
Benvenuto in AutonoMi

Ciao ${nome},

La tua candidatura è stata accettata e le tue credenziali di accesso sono state create con successo.

Codice Utente: ${codiceUtente}
Password: ${passwordPlain}

Importante: Ti consigliamo di cambiare la password al primo accesso.

Saluti,
Team AutonoMi
    `;
    
    sendMail(email, 'Credenziali di accesso - AutonoMi', testoEmail)
      .catch(err => {
        console.error('Errore nell\'invio email (non critico):', err);
        // Non blocchiamo la creazione dell'utente se l'email fallisce
      });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Errore in utente.crea.post.js:', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore nel salvataggio dell\'utente'
    });
  }
});


