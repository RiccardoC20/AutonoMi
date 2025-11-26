<template>
  <div class="container">
    <h1>Nuovo Viaggio</h1>

    <form @submit.prevent="invia">
      <label>Vettore</label>
      <input v-model="form.vettore" required />

      <label>Nome</label>
      <input v-model="form.nome" required />

      <label>Cognome</label>
      <input v-model="form.cognome" required />

      <label>Partenza</label>
      <input v-model="form.partenza" required />

      <label>Destinazione</label>
      <input v-model="form.destinazione" required />

      <label>Data del viaggio</label>
      <input type="date" v-model="form.dataViaggio" required />

      <label>Orario di partenza</label>
      <input type="time" v-model="form.orarioPartenza" required />

      <button class="btn">Invia</button>
    </form>

    <p v-if="success" class="ok">Viaggio inserito correttamente!</p>
    <p v-if="error" class="err">{{ error }}</p>
  </div>
</template>

<script setup>
const form = reactive({
  vettore: "",
  nome: "",
  cognome: "",
  partenza: "",
  destinazione: "",
  dataViaggio: "",
  orarioPartenza: ""
})

const success = ref(false)
const error = ref(null)

const invia = async () => {
  error.value = null
  success.value = false

  const { data, error: fetchError } = await useFetch('/api/viaggi/viaggi', {
    method: "POST",
    body: form
  })

  if (fetchError.value) {
    error.value = fetchError.value.data?.message || "Errore sconosciuto"
    return
  }

  success.value = true
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 25px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.btn {
  margin-top: 10px;
  padding: 10px;
  background: #28a745;
  color: white;
  border-radius: 6px;
}
.ok {
  margin-top: 15px;
  color: green;
}
.err {
  margin-top: 15px;
  color: red;
}
</style>
