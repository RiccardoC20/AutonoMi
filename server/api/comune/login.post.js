import connectDB from "../../utils/mongo";
import Comune from "../../models/comune.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // Legge il body della richiesta
    const body = await readBody(event);
    const { password } = body;

    // Validazione
    if ( !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password obbligatoria'
      });
    }

    // Cerca il comune nel database (codiceVettore è un numero)
    const comune = await Comune.findOne({ });
   
    if (!comune) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Comune non inserito nel DB'
      });
    }

    // Verifica la password con bcrypt
    const passwordMatch = await bcrypt.compare(password, comune.password);
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
        userId: comune._id.toString(),
        role: 'comune'
      },
      jwtSecret,
      {
        expiresIn: '365d'
      }
    );

    // Restituisce lo status
    return {
      success: true,
      token
    };
  } catch (error) {
    console.error('Errore in comune.post.js:', error);
    
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

