<script setup>
import Navbar from './components/Navbar.vue'
import HeroSearch from './components/HeroSearch.vue'
import ResultsGrid from './components/ResultsGrid.vue'
</script>


<template>
  <div>
    <header class="nav">
      <div class="container nav-inner">
        <Navbar />
      </div>
    </header>


    <section class="hero">
      <div class="container hero-inner">
        <p class="kicker">Independent • Assisted • Memory Care</p>
        <h1 class="h1">Find a warm, safe home for the next chapter</h1>
        <p class="sub">Compare amenities & pricing, read reviews, and book tours in minutes. Enter a ZIP code to see nearby senior living communities.</p>
        <HeroSearch />
      </div>
    </section>


    <main class="section">
      <div class="container">
        <ResultsGrid />
      </div>
    </main>


    <footer class="section footer">
      <div class="container" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
        <span>© {{ new Date().getFullYear() }} Cozy Senior Living</span>
        <nav>
          <a href="#">Why Us</a>
          <a href="#">Communities</a>
          <a href="#">FAQ</a>
        </nav>
      </div>
    </footer>
  </div>
</template>