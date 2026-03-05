<template>
  <div>
    <!-- Заголовок страницы -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Настройка IPoE</h1>
      <p class="mt-1 text-sm text-gray-500">
        Генерация конфигураций для D-Link коммутаторов (IPoE, DHCP relay)
      </p>
    </div>

    <!-- Генератор конфигураций -->
    <IPoEGenerator />
  </div>
</template>

<script setup>
import IPoEGenerator from '../components/tools/IPoEGenerator.vue'
</script>