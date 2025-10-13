<script setup>
import { ref } from 'vue'
import { useSeniorSearch } from '../composables/useSeniorSearch'


const zip = ref('')
const miles = ref(15)
const { searching, runSearch, setLocation } = useSeniorSearch()


const onSubmit = async () => {
await runSearch(zip.value, miles.value)
}
</script>


<template>
<div class="search-wrap">
  <form class="search-box" @submit.prevent="onSubmit" novalidate>
    <input
        inputmode="numeric"
        autocomplete="postal-code"
        pattern="^[0-9]{5}(?:-[0-9]{4})?$"
        title="Enter a 5-digit ZIP (optionally ZIP+4, e.g., 84111 or 84111-1234)"
        maxlength="10"
        placeholder="Enter ZIP code (e.g., 84111)"
        v-model="zip"
        @input="setLocation(null)"
    />
    <button class="cta search-btn" :disabled="searching">
      {{ searching ? 'Searching…' : 'Search' }}
    </button>
  </form>
</div>
</template>