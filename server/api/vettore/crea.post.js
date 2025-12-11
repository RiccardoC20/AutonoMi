import connectDB from "../../utils/mongo";
import Vettore from "../../models/vettori.model";
import { getNextSequenceValue } from "../../utils/sequence";
import { generateRandomPassword } from "../../utils/password";
import { sendVettoreCredentials } from "../../utils/email";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Legge il body della richiesta
    const body = await readBody(event);

    // Estrae i campi
    const nome = body.nome;
    const email = body.email;
    const numeroTelefono = body.numeroTelefono;
    const sede = body.sede;

    // Validazione: tutti i campi sono obbligatori
    if (!nome || !email || !numeroTelefono || !sede) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tutti i campi sono obbligatori: nome, email, numeroTelefono, sede'
      });
    }

    // Ottiene il prossimo codice vettore incrementale
    const codiceVettore = await getNextSequenceValue('vettori');

    // Genera password temporanea randomica di 8 caratteri
    const passwordPlain = generateRandomPassword(8);

    // Hasha la password con bcrypt
    const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10);
    const passwordHash = await bcrypt.hash(passwordPlain, rounds);

    // Crea il vettore in mongoDb
    await Vettore.create({
      codiceVettore,
      nome,
      email,
      numeroTelefono,
      sede,
      password: passwordHash,
    });
    
    // Invia email con le credenziali (in background, non blocca la risposta)   
    sendVettoreCredentials(email, codiceVettore, passwordPlain, nome)
      .catch(err => {
        console.error('Errore nell\'invio email (non critico):', err);
        // Non blocchiamo la creazione del vettore se l'email fallisce
      });

    return {
      success: true
    };
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

