import connectDB from "../../utils/mongo";
import Vettore from "../../models/vettori.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Legge il body della richiesta
    const body = await readBody(event);
    const { codiceVettore, password } = body;

    // Validazione
    if (!codiceVettore || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Codice vettore e password sono obbligatori'
      });
    }

    // Converte codiceVettore a numero (può arrivare come stringa dal form)
    const codiceVettoreNum = parseInt(codiceVettore, 10);
    
    if (isNaN(codiceVettoreNum)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Codice vettore non valido'
      });
    }

    // Cerca il vettore nel database (codiceVettore è un numero)
    const vettore = await Vettore.findOne({ codiceVettore: codiceVettoreNum });
   
    if (!vettore) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenziali non valide'
      });
    }

    // Verifica la password con bcrypt
    const passwordMatch = await bcrypt.compare(password, vettore.password);

    if (!passwordMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Password non valida'
      });
    }

    // Genera JWT token
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        userId: vettore._id.toString(),
        codiceVettore: vettore.codiceVettore,
        email: vettore.email,
        role: 'vettore' // Aggiunge il role al token
      },
      jwtSecret,
      {
        expiresIn: '7d' // Token valido per 7 giorni
      }
    );

    // Restituisce il token e i dati vettore (senza password)
    return {
      success: true,
      token,
      user: {
        _id: vettore._id,
        codiceVettore: vettore.codiceVettore,
        nome: vettore.nome,
        email: vettore.email,
        numeroTelefono: vettore.numeroTelefono,
        sede: vettore.sede
      }
    };
  } catch (error) {
    console.error('Errore in vettore/login.post.js:', error);
    
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

