<template>
  <div class="d-flex flex-column min-vh-100 p-3 text-white sidebar" :style="{ backgroundColor: color, width: '200px' }">
    <nav class="nav flex-column flex-grow-1">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="nav-link text-white text-decoration-none d-flex align-items-center p-2 mb-1 rounded small"
      >
        <i :class="link.icon" class="me-2"></i>
        {{ link.label }}
      </NuxtLink>
    </nav>

    <div class="mt-auto">
      <NuxtLink to="/logout" class="nav-link text-white text-decoration-none d-flex align-items-center p-2 rounded small">
        <i class="bi bi-box-arrow-right me-2"></i>
        Logout
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  props: {
    links: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: "#1c1f2b"
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  width: 200px;
  z-index: 1000; /* Assicura che stia sopra gli altri elementi */
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>