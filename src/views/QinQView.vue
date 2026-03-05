<template>
  <div>
    <!-- Заголовок страницы -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Настройка Q-in-Q</h1>
      <p class="mt-1 text-sm text-gray-500">
        Генерация конфигураций для D-Link коммутаторов (Q-in-Q, VLAN stacking)
      </p>
    </div>

    <!-- Генератор конфигураций -->
    <QinQGenerator />
  </div>
</template>

<script setup>
import QinQGenerator from '@/components/tools/QinQGenerator.vue'
</script>