import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDER_API);

/**
 * Invia email con SendGrid 
 */
export async function sendMail(to, subject, text) {
  try {

    const from = process.env.AUTONOMI_EMAIL;

    const msg = {
      to,
      from,
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
    
    throw error;
  }
}
