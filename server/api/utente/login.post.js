import connectDB from "../../utils/mongo";
import Utente from "../../models/utente.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Legge il body della richiesta
    const body = await readBody(event);
    const { codiceUtente, password } = body;

    // Validazione
    if (!codiceUtente || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Codice utente e password sono obbligatori'
      });
    }

    // Cerca l'utente nel database (codiceUtente è una stringa)
    const utente = await Utente.findOne({codiceUtente: codiceUtente});
   
    if (!utente) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenziali non valide'
      });
    }

    // Verifica la password con bcrypt
    // Nota: se la password nel DB è hashata con $2y$ (bcrypt PHP), 
    // bcrypt Node.js può gestirla, ma potrebbe essere necessario un workaround

    const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10); 
    const passwordMatch = await bcrypt.compare(password, utente.password);

    if (!passwordMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Password non valida'
      });
    }

    console.log("Login con successo di : " + codiceUtente)
    // Genera JWT token
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        userId: utente._id.toString(),
        codiceUtente: utente.codiceUtente,
        email: utente.email,
        role: 'utente'
      },
      jwtSecret,
      {
        expiresIn: '7d'
      }
    );

    // Restituisce il token e i dati utente (senza password)
    return {
      success: true,
      token,
      user: {
        _id: utente._id,
        codiceUtente: utente.codiceUtente,
        nome: utente.nome,
        cognome: utente.cognome,
        email: utente.email,
        dataNascita: utente.dataNascita,
        cellulare: utente.cellulare,
        indirizzo: utente.indirizzo
      }
    };
  } catch (error) {
    console.error('Errore in login.post.js:', error);
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante il login'
    });
  }
});

