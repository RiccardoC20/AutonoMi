<template>
  <div class="container">
    <h1>Lista Viaggi</h1>

    <NuxtLink to="/viaggi/nuovo" class="btn">➕ Inserisci nuovo viaggio</NuxtLink>

    <div v-if="pending">Caricamento...</div>

    <div v-if="error">Errore: {{ error }}</div>

    <div v-if="viaggi.length === 0 && !pending">Nessun viaggio trovato.</div>

    <div class="lista">
      <div
        class="card"
        v-for="v in viaggi"
        :key="v._id"
      >
        <h3>{{ v.nome }} {{ v.cognome }}</h3>
        <p>Vettore: {{ v.vettore }}</p>
        <p>Da: {{ v.partenza }} → {{ v.destinazione }}</p>
        <p>Data viaggio: {{ new Date(v.dataViaggio).toLocaleDateString() }}</p>
        <p>Orario partenza: {{ v.orarioPartenza }}</p>
        <small>Richiesto il: {{ new Date(v.richiestaAt).toLocaleString() }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data, pending, error } = await useFetch('/api/viaggi/viaggi')

const viaggi = data?.value?.data || []
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
}

.lista {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.btn {
  display: inline-block;
  margin-bottom: 20px;
  padding: 10px 15px;
  background: #0070f3;
  color: white;
  border-radius: 6px;
  text-decoration: none;
}
</style>
