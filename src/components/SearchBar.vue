<script setup>

const model = defineModel({default: ''})           // v-model from parent
const loading = defineModel('loading', {default: false})
const emit = defineEmits(['search'])

// keep only digits and cap at 5
function onInput(e) {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 5)
  model.value = digits
}

function onSubmit(e) {
  e.preventDefault()
  if (model.value.length === 5) emit('search')
}
</script>

<template>
  <form class="search-row" @submit="onSubmit" novalidate>
    <input
        class="input"
        type="text"
        :value="model"
        @input="onInput"
        inputmode="numeric"
        autocomplete="postal-code"
        maxlength="5"
        placeholder="Enter ZIP code (e.g., 84111)"
        aria-label="ZIP code"
    />
    <button class="button" :disabled="loading || model.length !== 5">
      <span v-if="!loading">🔎 Search</span>
      <span v-else>Searching…</span>
    </button>
  </form>
</template>

<style scoped>
.search-row {
  display: flex;
  gap: .6rem;
  width: min(720px, 100%);
  margin: 0 auto;
}

.input {
  flex: 1;
  min-width: 0;
  height: 52px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 0 14px;
  font-size: 1rem;
}

.input:focus {
  border-color: #0a6c8f;
  box-shadow: 0 0 0 4px rgba(10, 108, 143, .18);
  outline: 0;
}

.button {
  height: 52px;
  padding: 0 18px;
  border-radius: 12px;
  border: 0;
  background: #0a6c8f;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.button:disabled {
  opacity: .6;
  cursor: not-allowed;
}
</style>
