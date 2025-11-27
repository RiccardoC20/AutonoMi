<template>
  <div class="py-4">
    <h1 class="h2 mb-3">Homepage Provincia</h1>
    <p class="text-muted mb-4">
      Area dedicata alla provincia / ente regolatore per il monitoraggio del sistema.
    </p>

    <nav class="nav nav-pills mb-4">
      <NuxtLink
        to="/provincia/home"
        class="nav-link"
        active-class="active"
        exact-active-class="active"
      >
        Home
      </NuxtLink>
      <NuxtLink to="/provincia/report" class="nav-link" active-class="active">
        Report
      </NuxtLink>
    </nav>

    <div class="alert alert-danger">
      Questa è l'home dell'area Provincia. Tutta la navigazione /provincia/* è SPA interna.
    </div>
  </div>
</template>

<script setup>
// Logica specifica per l'homepage provincia in futuro
</script>


