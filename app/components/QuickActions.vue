<template>
  <div class="card">
    <div class="card-body">
      <h6 class="card-title">Azioni Rapide</h6>
      <div class="d-grid gap-2">
        <button
          v-for="action in actions"
          :key="action.id"
          class="btn btn-outline-primary text-start d-flex align-items-center"
          @click="handleAction(action)"
          :disabled="action.disabled"
        >
          <i :class="action.icon" class="me-2"></i>
          {{ action.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuickActions",
  props: {
    actions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['action-clicked'],
  methods: {
    handleAction(action) {
      if (!action.disabled) {
        this.$emit('action-clicked', action);
      }
    }
  }
}
</script>
