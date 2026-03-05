<template>
  <nav class="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Логотип и основное меню -->
        <div class="flex items-center space-x-8">
          <!-- Логотип -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center space-x-2 group">
              <svg class="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="font-bold text-xl text-white">SysAdmin Toolkit</span>
            </router-link>
          </div>

          <!-- Десктопное меню -->
          <div class="hidden md:flex md:space-x-1">
            <router-link
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                :class="[
                isActive(item.path)
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
            >
              <div class="flex items-center space-x-2">
                <span v-if="item.icon" v-html="item.icon" class="w-4 h-4"></span>
                <span>{{ item.name }}</span>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Поиск и мобильное меню -->
        <div class="flex items-center space-x-4">
          <!-- Поиск (для будущего функционала) -->
          <div class="hidden md:block">
            <div class="relative">
              <input
                  type="text"
                  placeholder="Поиск инструментов..."
                  class="bg-gray-700 text-white placeholder-gray-400 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-gray-600"
              >
              <svg class="absolute right-2 top-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Кнопка мобильного меню -->
          <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span class="sr-only">Открыть меню</span>
            <svg
                class="h-6 w-6"
                :class="{ 'hidden': mobileMenuOpen, 'block': !mobileMenuOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
                class="h-6 w-6"
                :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Мобильное меню -->
    <div
        class="md:hidden transition-all duration-300 ease-in-out"
        :class="mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'"
    >
      <div class="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
        <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="[
            isActive(item.path)
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          ]"
        >
          <div class="flex items-center space-x-2">
            <span v-if="item.icon" v-html="item.icon" class="w-5 h-5"></span>
            <span>{{ item.name }}</span>
          </div>
        </router-link>

        <!-- Поиск в мобильном меню -->
        <div class="px-3 py-2">
          <input
              type="text"
              placeholder="Поиск инструментов..."
              class="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

// Иконки для меню (SVG)
const icons = {
  password: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>`,
  network: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h6M4 6h16M4 18h16" /></svg>`,
  ipoe: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
  qinq: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z M8 12h8 M12 8v8" /></svg>`
}

const menuItems = [
  {
    path: '/password-generator',
    name: 'Генератор паролей',
    icon: icons.password,
    description: 'Создание надежных паролей'
  },
  {
    path: '/network',
    name: 'Сеть',
    icon: icons.network,
    description: 'Сетевые утилиты и калькуляторы'
  },
  {
    path: '/ipoe',
    name: 'Настройка IPoE',
    icon: icons.ipoe,
    description: 'IPoE конфигурации и настройки'
  },
  {
    path: '/qinq',
    name: 'Настройка Q-in-Q',
    icon: icons.qinq,
    description: 'Q-in-Q VLAN конфигурации'
  }
]

const isActive = (path) => {
  return route.path === path
}
</script>