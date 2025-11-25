import { connectDB } from '../../utils/database.js';
import Word from '../../models/Word.js';

export default defineEventHandler(async (event) => {
  try {
    // Connessione al database
    await connectDB();

    // Leggi il body della richiesta
    const body = await readBody(event);
    const { text } = body;

    // Validazione
    if (!text || text.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Il testo è obbligatorio'
      });
    }

    // Crea e salva la parola
    const word = new Word({ text: text.trim() });
    await word.save();

    return {
      success: true,
      data: word
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Errore nel salvataggio della parola'
    });
  }
});

