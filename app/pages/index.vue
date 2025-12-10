<script setup>
  import { sendEmail } from "../../server/api/comune/sendMail"
import { ref } from 'vue';

const form = ref({
  to: '',
  subject: '',
  text: ''
});

const message = ref('');

async function submitForm() {
  try {
    const response = await fetch('/api/comune/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });

    if (response.ok) {
      message.value = 'Email inviata con successo!';
      form.value = { to: '', subject: '', text: '' }; // reset form
    } else {
      message.value = 'Errore nell’invio dell’email.';
    }
  } catch (err) {
    console.error(err);
    message.value = 'Errore di connessione.';
  }
}
</script>

<template>
  <div class="email-form">
    <h1>Invia Email</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="to">Destinatario:</label>
        <input type="email" v-model="form.to" required id="to" />
      </div>

      <div>
        <label for="subject">Oggetto:</label>
        <input type="text" v-model="form.subject" required id="subject" />
      </div>

      <div>
        <label for="text">Testo:</label>
        <textarea v-model="form.text" required id="text"></textarea>
      </div>

      <button type="submit">Invia Email</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>


<style scoped>
.email-form {
  max-width: 500px;
  margin: auto;
  padding: 1rem;
}

.email-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.email-form input,
.email-form textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.email-form button {
  padding: 0.5rem 1rem;
}
</style>


<style scoped></style>
