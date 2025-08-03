<template>
  <form @submit.prevent="submitRecipe" enctype="multipart/form-data">
    <!-- ... your form fields ... -->

    <!-- Image Option -->
    <div class="mb-2">
      <label class="form-label">Image Option</label>
      <select class="form-select" v-model="imageOption">
        <option value="default">Default Image</option>
        <option value="online">Online Image URL</option>
        <option value="upload">Upload PNG</option>
      </select>
    </div>

    <!-- Image Preview/Input -->
    <div class="mb-3">
      <div v-if="imageOption === 'default'">
        <p class="text-muted">This is the default image that will be used:</p>
        <img :src="defaultImageUrl" alt="Default" class="img-thumbnail" width="200" />
      </div>

      <div v-else-if="imageOption === 'online'">
        <input
          type="url"
          class="form-control mb-2"
          v-model="onlineImageUrl"
          placeholder="Enter image URL"
        />
        <div v-if="onlineImageUrl">
          <p class="text-muted">Preview:</p>
          <img :src="onlineImageUrl" alt="Online Preview" class="img-thumbnail" width="200" />
        </div>
      </div>

      <div v-else-if="imageOption === 'upload'">
        <label class="btn btn-outline-secondary">
          <i class="bi bi-upload"></i> Choose PNG
          <input type="file" accept="image/png" @change="handleFileUpload" hidden />
        </label>
        <div v-if="uploadedPreview" class="mt-2">
          <p class="text-muted">Preview:</p>
          <img :src="uploadedPreview" alt="Uploaded Preview" class="img-thumbnail" width="200" />
        </div>
      </div>
    </div>

    <!-- Terms & Confirmation -->
    <!-- ... your terms modal ... -->

  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['user'])

const title = ref('')
const description = ref('')
const ingredients = ref('')
const steps = ref('')

const imageOption = ref('default')
const defaultImageUrl = ref('/assets/default.png')
const onlineImageUrl = ref('')
const uploadedFile = ref(null)
const uploadedPreview = ref(null)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const showTerms = ref(false)
const agreedTerms = ref(false)

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file || file.type !== 'image/png') {
    alert('Please upload a valid PNG image.')
    return
  }

  uploadedFile.value = file

  const reader = new FileReader()
  reader.onload = () => {
    uploadedPreview.value = reader.result
  }
  reader.readAsDataURL(file)
}

function confirmSubmit() {
  if (!agreedTerms.value) {
    alert('Please agree to the terms before submitting.')
    return
  }
  submitRecipe()
}

async function submitRecipe() {
  if (!props.user?.id) {
    alert('No user logged in')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('ingredients', ingredients.value)
  formData.append('steps', steps.value)
  formData.append('created_by', props.user.id)

  if (imageOption.value === 'default') {
    formData.append('image', defaultImageUrl.value)
  } else if (imageOption.value === 'online') {
    formData.append('image', onlineImageUrl.value.trim())
  } else if (imageOption.value === 'upload') {
    if (!uploadedFile.value) {
      alert('Please upload a PNG image.')
      return
    }
    formData.append('image', uploadedFile.value)
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/recipes`, {
      method: 'POST',
      body: formData
      // NOTE: Do NOT set Content-Type header manually for multipart/form-data
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to submit recipe')
    }

    alert('Recipe submitted successfully!')
    title.value = ''
    description.value = ''
    ingredients.value = ''
    steps.value = ''
    imageOption.value = 'default'
    onlineImageUrl.value = ''
    uploadedFile.value = null
    uploadedPreview.value = null
    showTerms.value = false
    agreedTerms.value = false
  } catch (err) {
    console.error('Error submitting recipe:', err)
    alert('Failed to submit recipe: ' + err.message)
  }
}
</script>

<style scoped>
img.img-thumbnail {
  object-fit: cover;
  max-height: 200px;
}
</style>
