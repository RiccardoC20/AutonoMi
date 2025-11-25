import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Word from '../server/models/Word.js';

// Carica variabili d'ambiente
dotenv.config();

// Connessione al database
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('    MONGODB_URI non è definita nel file .env');
      console.error('   Crea un file .env nella root del progetto con:');
      console.error('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
      return false;
    }
    
    const mongoURI = process.env.MONGODB_URI;
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB Connected');
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    return false;
  }
};

// Funzioni per interrogare il database
const queryDatabase = async () => {
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  try {
    // Esempio: conta tutte le parole
    const count = await Word.countDocuments();
    console.log(`\nTotale parole nel database: ${count}`);

    // Esempio: mostra le ultime 5 parole
    const recentWords = await Word.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();
    
    console.log('\nUltime 5 parole inserite:');
    recentWords.forEach((word, index) => {
      console.log(`${index + 1}. "${word.text}" - ${new Date(word.createdAt).toLocaleString('it-IT')}`);
    });

    // Esempio: cerca una parola specifica
    // const searchTerm = 'test';
    // const found = await Word.find({ text: { $regex: searchTerm, $options: 'i' } });
    // console.log(`\nParole contenenti "${searchTerm}":`, found);

    // Esempio: statistiche
    const stats = await Word.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgLength: { $avg: { $strLenCP: '$text' } }
        }
      }
    ]);
    
    if (stats.length > 0) {
      console.log(`\nStatistiche:`);
      console.log(`   - Lunghezza media parole: ${Math.round(stats[0].avgLength)} caratteri`);
    }

  } catch (error) {
    console.error('Errore nella query:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnessione chiusa');
    process.exit(0);
  }
};

// Esegui le query
queryDatabase();

