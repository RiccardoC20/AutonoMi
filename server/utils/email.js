import { Resend } from 'resend';

export async function sendVettoreCredentials(to, codiceVettore, password, nome) {
  try {
    const resend = new Resend(process.env.RESEND_API);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'no-reply@resend.dev',
      to: to,
      subject: 'Credenziali di accesso - AutonoMi',
      text: `
        Benvenuto in AutonoMi
        Ciao ${nome},
        Le tue credenziali di accesso sono state create con successo.
        Codice Vettore: ${codiceVettore}
        Password: ${password}
        Importante: Ti consigliamo di cambiare la password al primo accesso.
        Saluti, Team AutonoMi
      `,
    });

    if (error) {
      console.error('Errore nell\'invio email:', error);
      throw error;
    }

    console.log('Email inviata con successo:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Errore nell\'invio email:', error);
    throw error;
  }
}

