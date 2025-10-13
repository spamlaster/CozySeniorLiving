<script setup lang="ts">
interface Place {
  place_id: string
  name: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postcode?: string
  country?: string
  lat: number
  lon: number
  website?: string
  phone?: string
  categories?: string[]
}
const props = defineProps<{ results: Place[]; query: string; error: string | null; loading?: boolean }>()

function imageFor(p){
  const text = (p.name || '').toLowerCase()
  if (text.includes('memory')) return 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1600&q=80'
  if (text.includes('assisted')) return 'https://images.unsplash.com/photo-1522651739082-9e0804b0f3e5?auto=format&fit=crop&w=1600&q=80'
  if (text.includes('nursing')) return 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80'
  if (text.includes('retire') || text.includes('senior')) return 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?auto=format&fit=crop&w=1600&q=80'
  // default calm interior
  return 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=1600&q=80'
}
</script>

<template>
  <section class="results container">
    <div class="stack" style="margin-bottom:1rem; text-align:center;">
      <h2 style="margin:0;">Nearby Communities</h2>
      <p class="muted" style="margin:0;">Results for <strong>{{ query || '—' }}</strong></p>
    </div>

    <p v-if="error" style="color:#b91c1c; background:#fee2e2; padding:12px; border-radius:12px;" aria-live="polite">
      {{ error }}
    </p>

    <!-- Loading skeletons -->
    <div v-else-if="loading" class="result-grid" role="status" aria-live="polite">
      <article v-for="n in 6" :key="n" class="result-item">
        <div class="result-img" />
        <div class="result-body">
          <div class="result-title" style="height:18px;background:#e2e8f0;border-radius:8px;width:70%;"></div>
          <div class="result-meta" style="height:14px;background:#e9eef5;border-radius:8px;width:90%;"></div>
          <div style="height:28px;background:#eef2ff;border-radius:999px;width:160px;margin-top:8px;"></div>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div v-else-if="!results?.length" class="card" style="text-align:center; padding:1rem; border-radius:16px; background:#fff; border:1px solid #e2e8f0;">
      <p style="margin:.25rem 0 0;">No communities found within the search area. Try a nearby ZIP or larger city.</p>
    </div>

    <!-- Results grid -->
    <div v-else class="result-grid">
      <article v-for="p in props.results" :key="p.place_id" class="result-item">
        <img
            class="result-img"
            :alt="p.name"
            :src="imageFor(p)"
        />

        <div class="result-body">
          <div class="result-title">{{ p.name }}</div>
          <div class="result-meta">
            {{ p.address_line1 }}<span v-if="p.address_line2">, {{ p.address_line2 }}</span>
            <span v-if="p.city">, {{ p.city }}</span>
            <span v-if="p.state">, {{ p.state }}</span>
            <span v-if="p.postcode"> {{ p.postcode }}</span>
          </div>
          <div style="display:flex; gap:.5rem; flex-wrap: wrap; align-items:center; margin-top:.25rem;">
            <a class="badge" :href="`https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=17/${p.lat}/${p.lon}`" target="_blank" rel="noopener">Map</a>
            <a v-if="p.website" class="badge" :href="p.website" target="_blank" rel="noopener">Website</a>
            <a v-if="p.phone" class="badge" :href="`tel:${p.phone}`">Call</a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
