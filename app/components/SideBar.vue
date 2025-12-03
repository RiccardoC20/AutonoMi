<template>
  <div class="sidebar d-flex flex-column p-3" :style="{ background: color }">

    <ul class="nav nav-pills flex-column mb-auto">
      <li v-for="link in links" :key="link.to">
          <NuxtLink :to="link.to" class="nav-link link-light">
            <i :class="link.icon"></i> {{ link.label }}
          </NuxtLink>
      </li>
    </ul>

    <hr class="text-white">

    <div>
      <NuxtLink to="/logout" class="nav-link link-light">
        <i class="bi bi-box-arrow-right"></i> Logout
      </NuxtLink>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SideBar",
    props:{
      links: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: "AutonoMi"
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
  width: 450px;
  min-height: 100vh;
  background: #1c1f2b;
  border-right: 1px solid rgba(255, 255, 255, 0);
}

.nav-link {
  font-size: 1.5rem;
  padding: 30px 15px;
  border-radius: 30px;
  transition: 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0);
}
</style>
