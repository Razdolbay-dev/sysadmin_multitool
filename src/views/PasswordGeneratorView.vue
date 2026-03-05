<template>
  <div>
    <!-- Заголовок страницы -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Генератор паролей</h1>
      <p class="mt-1 text-sm text-gray-500">
        Создание надежных паролей с настраиваемыми параметрами
      </p>
    </div>

    <!-- Генератор паролей -->
    <PasswordGenerator />
  </div>
</template>

<script setup>
import PasswordGenerator from '@/components/tools/PasswordGenerator.vue'
</script>