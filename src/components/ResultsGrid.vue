<script setup>
import { computed } from 'vue'
import { useSeniorSearch } from '../composables/useSeniorSearch'


const { results, whereLabel, lastError } = useSeniorSearch()
const has = computed(() => results.value.length > 0)
</script>


<template>
  <section>
    <div style="display:flex;align-items:end;justify-content:space-between;margin-bottom:14px;gap:10px;flex-wrap:wrap">
      <div>
        <h3 style="margin:0 0 4px">Nearby Communities</h3>
        <div class="meta">Results for {{ whereLabel }}</div>
      </div>
    </div>


    <div v-if="lastError" class="empty">{{ lastError }}</div>
    <div v-else-if="!has" class="empty">No communities found yet. Try a different ZIP or larger radius.</div>


    <div v-else class="grid">
      <article v-for="r in results" :key="r.id" class="card">
        <div class="card-img">
          <img :src="r.photo" alt="" style="width:100%;height:100%;object-fit:cover" />
        </div>
        <div class="card-body">
          <span class="badge">{{ r.kind }}</span>
          <h4 class="h5">{{ r.name }}</h4>
          <div class="meta">{{ r.address }}</div>
          <div class="meta" v-if="r.phone">☎ {{ r.phone }}</div>
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
            <a v-if="r.website" class="cta" :href="r.website" target="_blank" rel="noopener">Website</a>
            <a class="cta" :href="`https://www.google.com/maps?q=${encodeURIComponent(r.name + ' ' + r.address)}`" target="_blank" rel="noopener">Directions</a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>