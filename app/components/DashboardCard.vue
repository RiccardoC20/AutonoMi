<template>
  <div class="card">
    <div class="card-body text-center">
      <i :class="icon" class="fs-1 text-success mb-2"></i>
      <h3 class="mb-1">{{ value }}</h3>
      <p class="text-muted mb-0">{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardCard",
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      default: "bi bi-info-circle"
    }
  }
}
</script>
