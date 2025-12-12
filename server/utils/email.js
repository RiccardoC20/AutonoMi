import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDER_API);

/**
 * Invia email con credenziali di accesso
 * @param {string} to - Email del destinatario
 * @param {string} codice - Codice Utente o Codice Vettore
 * @param {string} password - Password in chiaro
 * @param {string} nome - Nome del destinatario
 * @param {string} tipo - 'utente' o 'vettore'
 */
export async function sendCredentials(to, codice, password, nome, tipo) {
  try {
    // Determina il testo dell'email in base al tipo
    let testoEmail;
    let codiceLabel;

    if (tipo === 'vettore') {
      codiceLabel = 'Codice Vettore';
      testoEmail = `
Benvenuto in AutonoMi

Ciao ${nome},

Le tue credenziali di accesso sono state create con successo.

${codiceLabel}: ${codice}
Password: ${password}

Importante: Ti consigliamo di cambiare la password al primo accesso.

Saluti,
Team AutonoMi
      `;
    } else if (tipo === 'utente') {
      codiceLabel = 'Codice Utente';
      testoEmail = `
Benvenuto in AutonoMi

Ciao ${nome},

La tua candidatura è stata accettata e le tue credenziali di accesso sono state create con successo.

${codiceLabel}: ${codice}
Password: ${password}

Importante: Ti consigliamo di cambiare la password al primo accesso.

Saluti,
Team AutonoMi
      `;
    } else {
      throw new Error('Tipo non valido. Deve essere "utente" o "vettore"');
    }

    const msg = {
      to,
      from: "autonomi.noreply@gmail.com",
      subject: 'Credenziali di accesso - AutonoMi',
      text: testoEmail.trim()
    };

    const response = await sgMail.send(msg);
    console.log('Email inviata con successo!', response[0].statusCode);
    
    return {
      success: true,
      statusCode: response[0].statusCode
    };
  } catch (error) {
    console.error('Errore nell\'invio email:', error);
    
    if (error.response) {
      console.error(error.response.body);
    }
    
    throw error;
  }
}
