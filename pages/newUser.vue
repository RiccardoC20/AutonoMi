<!-- /Ubuntu/home/thecactus/dev/AutonoMi/pages/newUser.vue -->
<template>
  <div class="container py-4">
    <h3>Create New User</h3>
    <form @submit.prevent="onSubmit" class="mt-3">
      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">First name</label>
        <div class="col-sm-10">
          <input v-model="firstName" type="text" class="form-control" placeholder="First name" required />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Last name</label>
        <div class="col-sm-10">
          <input v-model="lastName" type="text" class="form-control" placeholder="Last name" required />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Birth date</label>
        <div class="col-sm-10">
          <input v-model="birthDate" type="date" class="form-control" required />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input v-model="email" type="email" class="form-control" placeholder="name@example.com" required />
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>

    <div v-if="status" class="mt-3">
      <div :class="statusClass" role="alert">{{ status }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const firstName = ref('')
const lastName = ref('')
const birthDate = ref('')
const email = ref('')

const status = ref('')
const statusClass = ref('')

async function onSubmit() {
  // basic client-side validation
  if (!firstName.value || !lastName.value || !birthDate.value || !email.value) {
    status.value = 'Please fill all fields.'
    statusClass.value = 'alert alert-warning'
    return
  }

  // create user object to save
  const user = {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    birthDate: birthDate.value, // ISO yyyy-mm-dd from <input type="date">
    email: email.value.trim().toLowerCase(),
    createdAt: new Date().toISOString()
  }

  try {
    // send to backend API that persists to MongoDB
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })

    if (!res.ok) throw new Error(await res.text())

    status.value = 'User saved successfully.'
    statusClass.value = 'alert alert-success'

    // clear form
    firstName.value = ''
    lastName.value = ''
    birthDate.value = ''
    email.value = ''
  } catch (err) {
    status.value = 'Failed to save user: ' + err.message
    statusClass.value = 'alert alert-danger'
  }
}
</script>

<style scoped>
/* optional small spacing tweaks */
</style>