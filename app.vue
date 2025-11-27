<template>
  <div class="app-root d-flex flex-column min-vh-100">
    <header class="bg-dark text-white py-3 mb-4">
      <nav class="container d-flex justify-content-between align-items-center">
        <h1 class="h4 mb-0">AutonoMi</h1>
        <ul class="nav">
          <li class="nav-item">
            <NuxtLink to="/" class="nav-link text-white">Home</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/login-utente" class="nav-link text-white">Login Utente</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/login-vettore" class="nav-link text-white">Login Vettore</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/login-provincia" class="nav-link text-white">Login Provincia</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <main class="flex-fill">
      <div class="container mb-5">
        <NuxtPage />
      </div>
    </main>

    <footer class="bg-light py-3 mt-auto border-top">
      <div class="container text-muted small text-center">
        AutonoMi &copy; {{ new Date().getFullYear() }} - Progetto demo
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useHead } from '#imports';

// Import Bootstrap CSS via CDN
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
      integrity:
        'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
      crossorigin: 'anonymous',
    },
  ],
});
</script>

<style>
html,
body {
  height: 100%;
}

.app-root {
  min-height: 100vh;
}
</style>

{
  "cells": [],
  "metadata": {
    "language_info": {
      "name": "python"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 2
}