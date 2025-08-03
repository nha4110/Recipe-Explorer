<template>
  <div>
    <p><strong>Username:</strong> {{ user.username }}</p>
    <p><strong>Created At:</strong> {{ user.created_at }}</p>

    <div class="mb-3">
      <label class="form-label">Current Password</label>
      <input
        type="password"
        class="form-control mb-2"
        v-model="currentPassword"
        placeholder="Current Password"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">New Password</label>
      <input
        type="password"
        class="form-control mb-2"
        v-model="newPassword"
        placeholder="New Password"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">Confirm New Password</label>
      <input
        type="password"
        class="form-control mb-2"
        v-model="confirmPassword"
        placeholder="Confirm New Password"
      />
    </div>

    <button class="btn btn-primary" @click="changePassword">Change Password</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps(['user'])
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function changePassword() {
  if (!currentPassword.value) {
    alert('Please enter your current password.')
    return
  }
  if (newPassword.value.length < 6) {
    alert('New password must be at least 6 characters.')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    alert('New password and confirmation do not match.')
    return
  }

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/user/${props.user.id}/password`,
      {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      },
      { headers: { 'Content-Type': 'application/json' } }
    )

    alert('Password changed successfully.')
    // Clear fields after success
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    if (error.response?.data?.error) {
      alert(`Error: ${error.response.data.error}`)
    } else {
      alert('Failed to update password.')
    }
  }
}
</script>
