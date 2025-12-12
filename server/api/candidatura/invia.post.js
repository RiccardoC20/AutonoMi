import connectDB from "../../utils/mongo";
import Candidatura from "../../models/candidatura.model";
import { getSupabaseClient } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    // dati form
    const formData = await readMultipartFormData(event);

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nessun dato ricevuto'
      });
    }

    // estrae i dati dal form
    let nome, cognome, email, dataNascita, cellulare, codiceFiscale, codiceUtente;
    let pdfFile = null;
    let pdfFileName = null;

    for (const item of formData) {
      if (item.name === 'pdf' && item.filename) {
        // PDF
        pdfFile = item.data;
        pdfFileName = item.filename;
      } else if (item.name) {
        // Campi
        const value = item.data.toString('utf-8');
        switch (item.name) {
          case 'nome':
            nome = value;
            break;
          case 'cognome':
            cognome = value;
            break;
          case 'email':
            email = value;
            break;
          case 'dataNascita':
            dataNascita = value;
            break;
          case 'cellulare':
            cellulare = value;
            break;
          case 'codiceFiscale':
            codiceFiscale = value;
            break;
          case 'codiceUtente':
            codiceUtente = value || null;
            break;
        }
      }
    }

    // validazione campi
    if (!nome || !cognome || !email || !dataNascita || !cellulare || !codiceFiscale) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tutti i campi sono obbligatori: nome, cognome, email, dataNascita, cellulare, codiceFiscale'
      });
    }

    // validazione PDF
    if (!pdfFile || !pdfFileName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Il file PDF è obbligatorio'
      });
    }

    // verifica PDF
    if (!pdfFileName.toLowerCase().endsWith('.pdf')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Il file deve essere un PDF'
      });
    }

    // nome file (cod_fiscale.pdf)
    const fileName = `${codiceFiscale}.pdf`;
    
    // upload PDF
    const supabase = getSupabaseClient();
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET;
    const filePath = fileName;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, pdfFile, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Errore upload Supabase:', uploadError);
      throw createError({
        statusCode: 500,
        statusMessage: `Errore durante l'upload del PDF: ${uploadError.message}`
      });
    }

    // genera URL firmato per bucket privato
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 31622400); // 366 giorni (s)

    if (signedUrlError) {
      console.error('Errore generazione URL firmato:', signedUrlError);
      throw createError({
        statusCode: 500,
        statusMessage: `Errore durante la generazione dell'URL del PDF: ${signedUrlError.message}`
      });
    }

    const pdfUrl = signedUrlData.signedUrl;

    // crea la candidatura nel DB
    const candidatura = await Candidatura.create({
      utente: {
        codiceUtente: codiceUtente || undefined,
        nome,
        cognome,
        email,
        dataNascita: new Date(dataNascita),
        cellulare,
        codiceFiscale
      },
      pdfUrl: pdfUrl
    });

    return {
      success: true,
      idCandidatura: candidatura._id.toString(),
      pdfUrl: pdfUrl
    };

  } catch (error) {
    console.error('Errore in candidatura/invia.post.js:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante l\'invio della candidatura'
    });
  }
});

