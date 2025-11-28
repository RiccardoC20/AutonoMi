<script setup lang="ts">
import { ref } from 'vue'
defineProps(['id', 'type', 'label'])

const inputRef = ref<HTMLInputElement | null>(null)
defineExpose({ inputRef })
</script>

<template>
  <div class="form-floating">
    <input 
      :type="type"
      class="form-control"
      :id="id"
      placeholder=""
      ref="inputRef"
    />
    <label :for="id">{{ label }}</label>
  </div>
</template>
