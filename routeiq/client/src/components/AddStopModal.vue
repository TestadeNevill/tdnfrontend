<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['stop-added', 'close'])

const name = ref('')
const riders = ref(5)
const submitting = ref(false)
const error = ref(null)

async function submit() {
  if (!name.value.trim()) {
    error.value = 'Stop name is required'
    return
  }
  submitting.value = true
  error.value = null

  const x = 0.08 + Math.random() * 0.84
  const y = 0.08 + Math.random() * 0.84

  try {
    const { data } = await axios.post('/api/stops', {
      name: name.value.trim(),
      x,
      y,
      riders: Number(riders.value),
    })
    emit('stop-added', data)
  } catch (e) {
    error.value = e.response?.data?.error ?? 'Failed to add stop'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <div class="modal__title">Add Pickup Stop</div>

      <div>
        <label class="modal__label">Stop name</label>
        <input
          v-model="name"
          class="modal__input"
          type="text"
          placeholder="e.g., Elm & 5th"
          autofocus
        />
      </div>

      <div>
        <label class="modal__label">Riders (1–60)</label>
        <input
          v-model.number="riders"
          class="modal__input"
          type="number"
          min="1"
          max="60"
        />
      </div>

      <p v-if="error" class="modal__error">{{ error }}</p>

      <div class="modal__actions">
        <button class="btn" @click="emit('close')">Cancel</button>
        <button class="btn btn--primary" :disabled="submitting" @click="submit">
          {{ submitting ? 'Adding…' : 'Add Stop' }}
        </button>
      </div>
    </div>
  </div>
</template>
