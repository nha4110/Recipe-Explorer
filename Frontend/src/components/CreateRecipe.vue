<template>
  <form @submit.prevent="submitRecipe">
    <!-- Title -->
    <div class="mb-2">
      <label class="form-label">Title</label>
      <input class="form-control" v-model="title" required />
    </div>

    <!-- Description -->
    <div class="mb-2">
      <label class="form-label">Description</label>
      <textarea class="form-control" v-model="description"></textarea>
    </div>

    <!-- Ingredients -->
    <div class="mb-2">
      <label class="form-label">Ingredients</label>
      <textarea class="form-control" v-model="ingredients"></textarea>
    </div>

    <!-- Steps -->
    <div class="mb-2">
    <label class="form-label">Steps</label>
    <textarea
        class="form-control"
        v-model="steps"
        rows="7"
        placeholder="1. Preheat the oven...\n2. Mix the ingredients...\n3. Bake for 20 minutes..."
    ></textarea>
    <small class="form-text text-muted">Write each step on a new line starting with a number.</small>
    </div>


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

    <div v-if="showTerms">
      <div class="alert alert-warning">
        <strong>Terms of Agreement</strong>
        <p>
          By submitting this recipe, you agree that:<br>
          - Recipes that are nonsensical, plagiarized, copied from others, or violate copyright will be deleted.<br>
          - You must be the original creator or have permission to share this recipe.<br>
          - Recipes that contain inappropriate, offensive, or misleading content will be removed.<br>
          - The platform reserves the right to moderate and remove any recipe at its discretion.
        </p>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="agreeTerms" v-model="agreedTerms" />
          <label class="form-check-label" for="agreeTerms">
            I have read and agree to the terms and conditions.
          </label>
        </div>
        <button class="btn btn-success mt-2" type="button" :disabled="!agreedTerms" @click="confirmSubmit">
          Confirm & Submit Recipe
        </button>
        <button class="btn btn-secondary mt-2 ms-2" type="button" @click="showTerms = false">
          Cancel
        </button>
      </div>
    </div>
    <button v-else class="btn btn-success" type="button" @click="showTerms = true">Submit Recipe</button>
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
const defaultImageUrl = ref('https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?_gl=1*1ltlpoq*_ga*NTY3MDEwMjI3LjE3NTQyNDg2NTI.*_ga_8JE65Q40S6*czE3NTQyNDg2NTEkbzEkZzEkdDE3NTQyNDg2NTckajU0JGwwJGgw')
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

async function submitRecipe() {
  let image = ''

  if (imageOption.value === 'default') {
    image = defaultImageUrl.value
  } else if (imageOption.value === 'online') {
    image = onlineImageUrl.value.trim()
  } else if (imageOption.value === 'upload') {
    if (!uploadedPreview.value) {
      alert('Please upload a PNG image.')
      return
    }
    image = uploadedPreview.value
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.value,
        description: description.value,
        ingredients: ingredients.value,
        steps: steps.value,
        image,
        created_by: props.user.id
      })
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
