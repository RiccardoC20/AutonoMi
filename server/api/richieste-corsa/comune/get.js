import connectDB from "../../../utils/mongo";
import RichiestaCorsa from "../../../models/richiestaCorsa.model";


export default defineEventHandler(async (event) => {
    try {

        await connectDB();

        // Cerca tutte le richieste corsa
        const richiesteCorse = await RichiestaCorsa.find({})
            .sort({ data: 1 }) // Ordina per data di creazione (più recenti prima)
            .exec();

        // Restituisce le richieste corsa
        return {
            success: true,
            data: richiesteCorse.map(richiesta => ({
                _id: richiesta._id,
                codiceUtente: richiesta.codiceUtente,
                codiceVettore: richiesta.codiceVettore,
                partenza: richiesta.partenza,
                arrivo: richiesta.arrivo,
                data: richiesta.data,
                km: richiesta.km,
            })),
            count: richiesteCorse.length
        };
    } catch (error) {
        console.error('Errore in get.js (richieste-corsa/comune):', error);
        
        // Se è già un errore creato con createError, rilancialo
        if (error.statusCode) {
            throw error;
        }
        
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Errore durante il recupero delle richieste corsa'
        });
    }
});