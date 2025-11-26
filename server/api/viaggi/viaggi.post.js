import { connectDB } from '../../utils/database.js';
import Viaggio from '../../models/Viaggio.js';

export default defineEventHandler(async (event) => {
  try {
    // Connessione al database
    await connectDB();

    // Legge il body della richiesta
    const body = await readBody(event);
    const {
      vettore,
      nome,
      cognome,
      partenza,
      destinazione,
      dataViaggio,
      orarioPartenza
    } = body;

    // Validazione manuale di tutti i campi obbligatori
    if (!vettore || !nome || !cognome || !partenza || !destinazione || !dataViaggio || !orarioPartenza) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tutti i campi sono obbligatori'
      });
    }

    // Crea e salva il viaggio
    const viaggio = new Viaggio({
      vettore: vettore.trim(),
      nome: nome.trim(),
      cognome: cognome.trim(),
      partenza: partenza.trim(),
      destinazione: destinazione.trim(),
      dataViaggio: new Date(dataViaggio),
      orarioPartenza: orarioPartenza.trim()
      // richiestaAt viene generato automaticamente dallo schema
    });

    await viaggio.save();

    return {
      success: true,
      data: viaggio
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Errore nel salvataggio del viaggio'
    });
  }
});
