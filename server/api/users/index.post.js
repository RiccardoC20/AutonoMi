import { connectDB } from '../../utils/database.js';
import User from '../../models/User.js';

export default defineEventHandler(async (event) => {
  try {
    // Connessione al database
    await connectDB();

    // Leggi il body della richiesta
    const body = await readBody(event);
    const { firstName, lastName, birthDate, email } = body;

    // Validazione
    if (!firstName || firstName.trim().length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Il Nome è obbligatorio'
      });
    }
    if (!lastName || lastName.trim().length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Il Cognome è obbligatorio'
      });
    }
    if (!birthDate) {
      throw createError({
        statusCode: 400,
        message: 'La data di nascita è obbligatoria'
      });
    }
    if (!email || email.trim().length === 0) {
      throw createError({
        statusCode: 400,
        message: 'L\'email è obbligatoria'
      });
    }

    // Crea e salva la parola
    const user = new User({ firstName: firstName.trim(), lastName: lastName.trim(), birthDate: birthDate, email: email.trim() });
    await user.save();

    return {
      success: true,
      data: user
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Errore nel salvataggio dell\'utente'
    });
  }
});

