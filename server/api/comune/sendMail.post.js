import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDER_API);

export default defineEventHandler(async (event) => {
  try {
    // Legge il body della richiesta
    const body = await readBody(event);
    const { to, subject, text } = body;

    // Validazione
    if (!to || !subject || !text) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Campi obbligatori: to, subject, text'
      });
    }

    const msg = {
      to,
      from: "autonomi.noreply@gmail.com",
      subject,
      text
    };

    const response = await sgMail.send(msg);
    console.log("Email inviata!", response[0].statusCode);
    
    return {
      success: true,
      statusCode: response[0].statusCode
    };
  } catch (error) {
    console.error("Errore invio email:", error);
    
    if (error.response) {
      console.error(error.response.body);
    }
    
    // Se è già un errore creato con createError, rilancialo
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante l\'invio dell\'email'
    });
  }
});
