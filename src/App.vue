<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <!-- Header -->
    <header class="bg-gradient-to-r from-primary to-secondary text-white">
      <div class="container mx-auto px-4 py-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-2">Bash PS1 Generator</h1>
        <p class="text-lg opacity-90 mb-6">Create beautiful command line prompts with drag and drop</p>

        <!-- Navigation -->
        <nav class="flex justify-center gap-4">
          <RouterLink 
            to="/" 
            class="btn btn-ghost btn-lg text-white hover:bg-white/10"
            active-class="bg-white/20"
          >
            Builder
          </RouterLink>
          <RouterLink 
            to="/about" 
            class="btn btn-ghost btn-lg text-white hover:bg-white/10"
            active-class="bg-white/20"
          >
            About
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>