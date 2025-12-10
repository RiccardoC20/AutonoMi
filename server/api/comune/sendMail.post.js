import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDER_API);

export async function sendEmail(to, subject, text) {
    const msg = {
        to,
        from: "autonomi.noreply@gmail.com",
        subject,
        text
    };
    try {
        const response = await sgMail.send(msg);
        console.log("Email inviata!", response[0].statusCode);
        return response;
    } catch (error) {
        console.error("Errore invio email:", error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
}
