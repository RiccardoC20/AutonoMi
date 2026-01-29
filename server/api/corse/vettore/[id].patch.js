import connectDB from "../../../utils/mongo";
import Corsa from "../../../models/corsa.model";

export default defineEventHandler(async (event) => {
    const { id } = event.context.params; // Get the ID from the request parameters

    try {
        await connectDB();

        // Aggiorna il campo "effettuata" a true per la corsa specificata
        const updatedCorsa = await Corsa.findByIdAndUpdate(
            id,
            { effettuata: true },
            { new: true }
        );


        if (!updatedCorsa) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Corsa non trovata'
            });
        }

        console.log("La corsa ", updatedCorsa.id , " è stata promossa a effettuata");

        // Ritorna un booleano per indicare il successo dell'aggiornamento
        return {
            success: true,
            data: updatedCorsa
        };
    } catch (error) {
        console.error('Errore in [id].patch.js:', error);
        
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Errore durante l\'aggiornamento della corsa'
        });
    }
});
