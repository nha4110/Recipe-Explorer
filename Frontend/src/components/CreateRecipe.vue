<template>
  <form @submit.prevent="submitRecipe">
    <div class="mb-2">
      <label class="form-label">Title</label>
      <input class="form-control" v-model="title" required />
    </div>
    <div class="mb-2">
      <label class="form-label">Description</label>
      <textarea class="form-control" v-model="description"></textarea>
    </div>
    <div class="mb-2">
      <label class="form-label">Ingredients</label>
      <textarea class="form-control" v-model="ingredients"></textarea>
    </div>
    <div class="mb-2">
      <label class="form-label">Steps</label>
      <textarea class="form-control" v-model="steps"></textarea>
    </div>
    <button class="btn btn-success" type="submit">Submit Recipe</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['user'])
const title = ref('')
const description = ref('')
const ingredients = ref('')
const steps = ref('')

async function submitRecipe() {
  await fetch('http://localhost:8080/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: title.value,
      description: description.value,
      ingredients: ingredients.value,
      steps: steps.value,
      created_by: props.user.id
    })
  })
  alert('Recipe submitted!')
}
</script>
