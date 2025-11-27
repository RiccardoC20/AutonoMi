<template>
  <div class="py-5">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold mb-3">Benvenuto in AutonoMi</h1>
      <p class="lead text-muted">
        Seleziona il tipo di accesso per entrare nell'area dedicata.
      </p>
    </div>

    <div class="row g-4 justify-content-center">
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 card-title">Utente</h2>
            <p class="card-text flex-fill text-muted">
              Accesso per gli utenti finali che utilizzano i servizi di trasporto.
            </p>
            <NuxtLink to="/login-utente" class="btn btn-primary mt-2 w-100">
              Vai al login Utente
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 card-title">Vettore</h2>
            <p class="card-text flex-fill text-muted">
              Accesso per gli operatori dei vettori di trasporto.
            </p>
            <NuxtLink to="/login-vettore" class="btn btn-success mt-2 w-100">
              Vai al login Vettore
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 card-title">Provincia</h2>
            <p class="card-text flex-fill text-muted">
              Accesso per la provincia / ente regolatore.
            </p>
            <NuxtLink to="/login-provincia" class="btn btn-outline-dark mt-2 w-100">
              Vai al login Provincia
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Nessuna logica per ora, solo pagina di selezione accesso
</script>

<style scoped>
.card-title {
  margin-bottom: 0.5rem;
}
</style>
