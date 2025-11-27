<template>
  <div class="py-4">
    <h1 class="h2 mb-3">Homepage Vettore</h1>
    <p class="text-muted mb-4">
      Benvenuto nell'area dedicata agli operatori dei vettori di trasporto.
    </p>

    <nav class="nav nav-pills mb-4">
      <NuxtLink to="/vettore/home" class="nav-link" active-class="active" exact-active-class="active">
        Home
      </NuxtLink>
      <NuxtLink to="/vettore/consegne" class="nav-link" active-class="active">
        Consegne
      </NuxtLink>
      <NuxtLink to="/vettore/storico" class="nav-link" active-class="active">
        Storico
      </NuxtLink>
    </nav>

    <div class="alert alert-success">
      Questa è l'home dell'area Vettore. Tutta la navigazione /vettore/* è SPA interna.
    </div>
  </div>
</template>

<script setup>
// Logica specifica per l'homepage vettore in futuro
</script>


