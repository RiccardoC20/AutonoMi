<template>
  <div class="py-4">
    <h1 class="h2 mb-3">Homepage Utente</h1>
    <p class="text-muted mb-4">
      Benvenuto nell'area riservata agli utenti finali.
    </p>

    <nav class="nav nav-pills mb-4">
      <NuxtLink to="/utente/home" class="nav-link" active-class="active" exact-active-class="active">
        Home
      </NuxtLink>
      <NuxtLink to="/utente/profilo" class="nav-link" active-class="active">
        Profilo
      </NuxtLink>
      <NuxtLink to="/utente/statistiche" class="nav-link" active-class="active">
        Statistiche
      </NuxtLink>
      <NuxtLink to="/utente/ordini" class="nav-link" active-class="active">
        Ordini
      </NuxtLink>
    </nav>

    <div class="alert alert-info">
      Questa è l'home dell'area Utente. Tutta la navigazione /utente/* è SPA interna (senza
      ricaricare la pagina).
    </div>
  </div>
</template>

<script setup>
// Logica specifica per l'homepage utente in futuro
</script>


