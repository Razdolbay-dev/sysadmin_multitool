<template>
  <div class="min-h-screen bg-gray-50">
    <NavigationMenu />

    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Хлебные крошки -->
        <nav class="flex mb-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <router-link to="/" class="hover:text-gray-700">Главная</router-link>
            </li>
            <li v-if="currentPage" class="flex items-center space-x-2">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium text-gray-700">{{ currentPage }}</span>
            </li>
          </ol>
        </nav>

        <!-- Контент страницы -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-sm text-gray-500 text-center">
          SysAdmin Toolkit © {{ new Date().getFullYear() }} - Инструменты для системного администратора
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationMenu from '@/components/NavigationMenu.vue'

const route = useRoute()

const currentPage = computed(() => {
  const pages = {
    '/password-generator': 'Генератор паролей',
    '/network': 'Сеть',
    '/ipoe': 'Настройка IPoE',
    '/qinq': 'Настройка Q-in-Q'
  }
  return pages[route.path] || ''
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>