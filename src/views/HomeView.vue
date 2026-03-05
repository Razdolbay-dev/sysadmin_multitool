<template>
  <div>
    <!-- Приветственный баннер -->
    <div class="bg-indigo-700 rounded-lg shadow-lg mb-8">
      <div class="px-6 py-8 sm:px-8 sm:py-10">
        <h1 class="text-3xl font-bold text-white mb-2">
          Добро пожаловать в SysAdmin Toolkit
        </h1>
        <p class="text-indigo-100 text-lg max-w-3xl">
          Набор инструментов для системного администратора. Генерируйте пароли,
          настраивайте сетевые параметры и создавайте конфигурации быстро и легко.
        </p>
      </div>
    </div>

    <!-- Сетка инструментов -->
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Доступные инструменты</h2>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      <!-- Генератор паролей -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-indigo-100 rounded-md p-3">
              <svg class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Генератор паролей</h3>
              <p class="text-sm text-gray-500">Создание надежных паролей с настраиваемыми параметрами</p>
            </div>
          </div>
          <div class="mt-4">
            <router-link to="/password-generator" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Перейти к инструменту →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Сеть -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h6M4 6h16M4 18h16" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Сеть</h3>
              <p class="text-sm text-gray-500">IP калькуляторы, конвертеры и сетевые утилиты</p>
            </div>
          </div>
          <div class="mt-4">
            <router-link to="/network" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Перейти к инструменту →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Настройка IPoE -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Настройка IPoE</h3>
              <p class="text-sm text-gray-500">Генерация конфигураций для IPoE подключений</p>
            </div>
          </div>
          <div class="mt-4">
            <router-link to="/ipoe" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Перейти к инструменту →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Настройка Q-in-Q -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <svg class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z M8 12h8 M12 8v8" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Настройка Q-in-Q</h3>
              <p class="text-sm text-gray-500">VLAN stacking конфигурации для провайдеров</p>
            </div>
          </div>
          <div class="mt-4">
            <router-link to="/qinq" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Перейти к инструменту →
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Быстрые действия
    <div class="mt-8 bg-gray-50 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Быстрые действия</h3>
      <div class="flex flex-wrap gap-3">
        <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить в избранное
        </button>
        <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          История
        </button>
      </div>
    </div>
    -->
  </div>
</template>