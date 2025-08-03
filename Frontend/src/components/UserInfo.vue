<template>
  <div>
    <p><strong>Username:</strong> {{ user.username }}</p>
    <p><strong>Created At:</strong> {{ user.created_at }}</p>
    <div class="mb-3">
      <label class="form-label">Change Password</label>
      <input type="password" class="form-control mb-2" v-model="newPassword" placeholder="New Password" />
      <button class="btn btn-primary" @click="changePassword">Change</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['user'])
const newPassword = ref('')

function changePassword() {
  if (newPassword.value.length < 6) {
    alert('Password must be at least 6 characters.')
    return
  }
  console.log('Change password to:', newPassword.value)
  // PATCH request here
}
</script>