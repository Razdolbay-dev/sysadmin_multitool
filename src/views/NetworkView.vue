<template>
  <div>
    <!-- Заголовок страницы -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Сетевые утилиты</h1>
      <p class="mt-1 text-sm text-gray-500">
        Калькулятор IP адресов, конвертеры и другие сетевые инструменты
      </p>
    </div>

    <!-- Вкладки инструментов -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === tab.id
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Контент вкладок -->
    <div class="mt-6">
      <!-- IP калькулятор -->
      <div v-if="activeTab === 'ipcalc'">
        <IPCalculator />
      </div>

      <!-- Конвертер форматов
      <div v-if="activeTab === 'converter'" class="bg-white shadow sm:rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Конвертер форматов</h3>
        <p class="text-gray-500">В разработке. Здесь будет конвертер между десятичным, двоичным и шестнадцатеричным форматами.</p>
      </div>-->

      <!-- WHOIS
      <div v-if="activeTab === 'whois'" class="bg-white shadow sm:rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">WHOIS запрос</h3>
        <p class="text-gray-500">В разработке. Здесь будет выполнение WHOIS запросов.</p>
      </div>-->

      <!-- Ping/Traceroute
      <div v-if="activeTab === 'ping'" class="bg-white shadow sm:rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Ping / Traceroute</h3>
        <p class="text-gray-500">В разработке. Здесь будет выполнение ping и traceroute (требуется бэкенд).</p>
      </div>-->
    </div>

    <!-- Быстрые ссылки -->
    <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
          v-for="link in quickLinks"
          :key="link.name"
          class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
      >
        <div class="flex-shrink-0">
          <div class="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-width="2" :d="link.icon" />
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <a href="#" class="focus:outline-none">
            <span class="absolute inset-0" aria-hidden="true"></span>
            <p class="text-sm font-medium text-gray-900">{{ link.name }}</p>
            <p class="text-sm text-gray-500 truncate">{{ link.description }}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IPCalculator from '@/components/tools/IPCalculator.vue'

const activeTab = ref('ipcalc')

const tabs = [
  { id: 'ipcalc', name: 'IP калькулятор' },
  // { id: 'converter', name: 'Конвертер' },
  // { id: 'whois', name: 'WHOIS' },
  // { id: 'ping', name: 'Ping / Traceroute' }
]

const quickLinks = [
  {
    name: 'IPv4 калькулятор',
    description: 'Расчет подсетей IPv4',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    name: 'IPv6 калькулятор',
    description: 'Расчет подсетей IPv6',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
  },
  {
    name: 'MAC адреса',
    description: 'Конвертер MAC адресов',
    icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
  },
  {
    name: 'CIDR калькулятор',
    description: 'Расчет CIDR нотаций',
    icon: 'M8 9l3 3-3 3m5 0h6M4 6h16M4 18h16'
  }
]
</script>