<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const props = withDefaults(defineProps<{
  slides?: string[]
  intervalMs?: number
  overlaySearch?: boolean
}>(), {
  slides: () => [
    'https://images.unsplash.com/photo-1519832979-6fa011b2a3d9?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80',
  ],
  intervalMs: 5500,
  overlaySearch: true,
})

const i = ref(0)
let t: number | null = null
function next() { i.value = (i.value + 1) % props.slides.length }

onMounted(() => { t = window.setInterval(next, props.intervalMs) })
onBeforeUnmount(() => { if (t) clearInterval(t) })

const bg = computed(() => ({ backgroundImage: `url(${props.slides[i.value]})` }))
</script>

<template>
  <section class="hero-block">
    <!-- background image layer -->
    <div class="hero-bg" :style="bg" />
    <div class="hero-overlay" />

    <!-- centered headline/sub -->
    <div class="hero-content container">
      <div>
        <div class="kicker">Independent • Assisted • Memory Care</div>
        <h1>Find a Warm, Safe Home for the Next Chapter</h1>
        <p>Search trusted communities near you, compare amenities & pricing, and book tours in minutes.</p>
      </div>
    </div>

    <!-- overlay search slot (shows when overlaySearch = true) -->
    <div v-if="overlaySearch" class="hero-search">
      <slot name="search" />
    </div>

    <div v-else class="hero-search-below">
      <slot name="search" />
    </div>
    <div class="hero-stack">
      <div
          v-for="(src, idx) in slides"
          :key="src"
          class="hero-bg"
          :style="{ backgroundImage: `url(${src})`, opacity: idx === i ? 1 : 0 }"
      />
    </div>
  </section>
</template>

<style scoped>
/* FULL-BLEED HERO (ignores centered parent widths) */
.hero-block{
  position: relative;
  min-height: clamp(420px, 64vh, 760px);

  /* bleed edge-to-edge without causing horizontal scroll */
  margin-left: calc(50% - 50svw);
  margin-right: calc(50% - 50svw);
  width: 100svw;
  overflow: clip; /* keep overlay clean */
}

/* Fallback for browsers without svw */
@supports not (width: 100svw) {
  .hero-block{
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    width: 100vw;
  }
}

/* Background image layer */
.hero-bg{
  position:absolute; inset:0;
  background-size: cover; background-position: center; background-repeat:no-repeat;
  transform: translateZ(0) scale(1.02); /* subtle edge bleed & smoothness */
  will-change: background-image, transform;
}

/* Overlay + content */
.hero-overlay{
  position:absolute; inset:0;
  background: linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.18) 35%, rgba(0,0,0,.35));
}
.hero-content{
  position: relative; z-index: 1;
  display: grid; place-items: center; text-align:center; color:#fff;
  padding: 4.5rem 1rem 6.5rem;
}
.hero-content h1{ margin:0 0 .75rem; font-size: clamp(2rem, 5vw, 3.5rem); line-height:1.05; }
.hero-content p{ margin:0; max-width: 62ch; opacity:.95; font-size: clamp(1rem, 2.2vw, 1.2rem); }

/* Search card overlap */
.hero-search{
  position: relative; z-index: 2;
  margin-top: -84px; /* pull it up over the hero */
}
/* reach into child (scoped) */
.hero-search :deep(.search-card){
  width: min(1000px, 95%);
  margin-left: auto; margin-right: auto;
}

.hero-stack{
  position:absolute; inset:0; overflow:hidden;
}
.hero-bg{
  position:absolute; inset:0;
  background-size: cover; background-position: center; background-repeat:no-repeat;
  will-change: opacity;
  transition: opacity 700ms ease-in-out;
  transform: translateZ(0) scale(1.02);
}

/* If not overlapping */
.hero-search-below{ margin-top: 1rem; }

@media (max-width:680px){
  .hero-content{ padding-bottom: 5rem; }
  .hero-search{ margin-top: -64px; }
}
</style>
