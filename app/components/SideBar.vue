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
      <button 
        type="button" 
        class="nav-link text-white text-decoration-none d-flex align-items-center p-2 rounded small w-100 border-0 bg-transparent"
        data-bs-toggle="modal" 
        data-bs-target="#staticBackdrop"
      >
        <i class="bi bi-box-arrow-right me-2"></i>
        Logout
      </button>
    </div>
  </div>

<!-- Modal Logout -->
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Logout</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Conferma Logout.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="logout()">Conferma</button>
      </div>
    </div>
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
    },
    role: {
      type: String,
      default: "utente"
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      navigateTo(`/${this.role}/login`);
    }
  }
};

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
  background-color: #0000001f;
}

button.nav-link {
  cursor: pointer;
}
</style>  