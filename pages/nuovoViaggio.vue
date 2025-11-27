<template>
  <div class="container py-4">
    <h1 class="fw-bold mb-4">✏️ Inserisci Nuovo Viaggio</h1>

    <form class="row g-3" @submit.prevent="invia">

      <div class="col-md-6">
        <label class="form-label">Vettore</label>
        <input v-model="form.vettore" class="form-control" required />
      </div>

      <div>

      </div>

      <div class="col-md-6">
        <label class="form-label">Nome</label>
        <input v-model="form.nome" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Cognome</label>
        <input v-model="form.cognome" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Partenza</label>
        <input v-model="form.partenza" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Destinazione</label>
        <input v-model="form.destinazione" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Data del viaggio</label>
        <input type="date" v-model="form.dataViaggio" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Orario di partenza</label>
        <input type="time" v-model="form.orarioPartenza" class="form-control" required />
      </div>

      <div class="col-12 d-flex gap-2 mt-3">
        <button class="btn btn-success px-4">Salva</button>
        <NuxtLink to="/" class="btn btn-secondary">Indietro</NuxtLink>
      </div>
    </form>

    <div v-if="success" class="alert alert-success mt-4">
      ✓ Viaggio inserito correttamente!
    </div>

    <div v-if="error" class="alert alert-danger mt-4">
      Errore: {{ error }}
    </div>
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
  success.value = false
  error.value = null

const { $authHeader } = useNuxtApp()

  const { error: fetchError } = await useFetch("/api/viaggi", {
  method: "POST",
  headers: $authHeader(),
  body: form
})

  if (fetchError.value) {
    error.value = fetchError.value.data?.statusMessage || "Errore sconosciuto"
    return
  }

  success.value = true

  // reset form
  Object.keys(form).forEach(k => form[k] = "")
}
</script>
