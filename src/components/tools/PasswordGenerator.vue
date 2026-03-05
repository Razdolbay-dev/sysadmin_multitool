<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
        Генератор паролей
      </h3>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Левая колонка - настройки -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Основные параметры -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-4">Основные параметры</h4>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Длина пароля: {{ passwordLength }}
                </label>
                <input
                    type="range"
                    v-model.number="passwordLength"
                    min="4"
                    max="64"
                    class="w-full"
                >
                <div class="flex justify-between text-xs text-gray-500">
                  <span>4</span>
                  <span>64</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Количество паролей: {{ passwordCount }}
                </label>
                <input
                    type="range"
                    v-model.number="passwordCount"
                    min="1"
                    max="50"
                    class="w-full"
                >
                <div class="flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Наборы символов -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-4">Использовать символы</h4>

            <div class="space-y-3">
              <div>
                <label class="flex items-center">
                  <input
                      type="checkbox"
                      v-model="useUppercase"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">Прописные латинские буквы</span>
                </label>
                <div class="ml-6 mt-1 text-xs font-mono text-gray-500">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                </div>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                      type="checkbox"
                      v-model="useLowercase"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">Строчные латинские буквы</span>
                </label>
                <div class="ml-6 mt-1 text-xs font-mono text-gray-500">
                  abcdefghijklmnopqrstuvwxyz
                </div>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                      type="checkbox"
                      v-model="useNumbers"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">Цифры</span>
                </label>
                <div class="ml-6 mt-1 text-xs font-mono text-gray-500">
                  0123456789
                </div>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                      type="checkbox"
                      v-model="useSpace"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">Пробел</span>
                </label>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                      type="checkbox"
                      v-model="useSeparators"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">Разделители (минус и подчеркивание)</span>
                </label>
                <div class="ml-6 mt-1 text-xs font-mono text-gray-500">
                  - _
                </div>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                      type="checkbox"
                      v-model="useSpecial"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">Специальные символы</span>
                </label>
                <div class="ml-6 mt-1 text-xs font-mono text-gray-500">
                  ~!@#$%^&*()+
                </div>
              </div>
            </div>
          </div>

          <!-- Исключения -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-4">Исключения</h4>

            <div>
              <label class="flex items-start">
                <input
                    type="checkbox"
                    v-model="excludeAmbiguous"
                    class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700">
                  Не использовать символы с неоднозначным написанием
                </span>
              </label>
              <div class="ml-6 mt-2 text-xs font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
                Il1oO0 оО sS5
              </div>
              <p class="ml-6 mt-1 text-xs text-gray-400">
                (I, l, 1, o, O, 0, о, О, s, S, 5)
              </p>
            </div>
          </div>

          <!-- Предупреждение -->
          <div v-if="!hasCharSets" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-yellow-700">
                  Выберите хотя бы один набор символов
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Правая колонка - результаты -->
        <div class="lg:col-span-2">
          <!-- Переключатель режима отображения -->
          <div class="mb-4 flex justify-end">
            <div class="bg-gray-100 rounded-lg p-1 flex">
              <button
                  @click="viewMode = 'individual'"
                  class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                  :class="viewMode === 'individual'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-700'"
              >
                По отдельности
              </button>
              <button
                  @click="viewMode = 'list'"
                  class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                  :class="viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-700'"
              >
                Списком
              </button>
            </div>
          </div>

          <!-- Кнопка генерации -->
          <div class="mb-4">
            <button
                @click="generatePasswords"
                :disabled="!hasCharSets"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Сгенерировать пароли
            </button>
          </div>

          <!-- Режим "По отдельности" -->
          <div v-if="viewMode === 'individual'" class="space-y-3">
            <div
                v-for="(password, index) in passwords"
                :key="index"
                class="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 group hover:bg-gray-100 transition-colors"
            >
              <span class="flex-1 font-mono text-sm text-gray-900 break-all">{{ password }}</span>
              <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    @click="copyPassword(password)"
                    class="p-1 text-gray-400 hover:text-indigo-600 rounded"
                    title="Копировать"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Режим "Списком" -->
          <div v-if="viewMode === 'list'" class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between items-center mb-3">
              <span class="text-sm text-gray-500">Сгенерировано паролей: {{ passwords.length }}</span>
              <button
                  @click="copyAllPasswords"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="-ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Копировать все
              </button>
            </div>
            <textarea
                readonly
                :value="passwords.join('\n')"
                rows="10"
                class="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            ></textarea>
          </div>

          <!-- Уведомление о копировании -->
          <div v-if="copied" class="mt-3 text-sm text-green-600 flex items-center">
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ copiedMessage }}
          </div>

          <!-- Информация о сложности -->
          <div v-if="passwords.length > 0" class="mt-4 text-xs text-gray-400 border-t border-gray-200 pt-4">
            <div class="flex items-center space-x-4">
              <span>Набор символов: {{ charSetSize }} символов</span>
              <span>•</span>
              <span>Энтропия: {{ entropyBits }} бит</span>
              <span>•</span>
              <span>Сложность:
                <span :class="strengthClass">{{ passwordStrength }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Основные параметры
const passwordLength = ref(12)
const passwordCount = ref(5)
const viewMode = ref('individual')

// Наборы символов
const useUppercase = ref(true)
const useLowercase = ref(true)
const useNumbers = ref(true)
const useSpace = ref(false)
const useSeparators = ref(false)
const useSpecial = ref(false)
const excludeAmbiguous = ref(true)

// Состояние
const passwords = ref([])
const copied = ref(false)
const copiedMessage = ref('')

// Наборы символов
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SPACE = ' '
const SEPARATORS = '-_'
const SPECIAL = '~!@#$%^&*()+'
const AMBIGUOUS = 'Il1oO0оОsS5' // Латинские и русские символы

// Проверка наличия выбранных наборов
const hasCharSets = computed(() => {
  return useUppercase.value || useLowercase.value || useNumbers.value ||
      useSpace.value || useSeparators.value || useSpecial.value
})

// Формирование набора символов
const charSet = computed(() => {
  let chars = ''

  if (useUppercase.value) chars += UPPERCASE
  if (useLowercase.value) chars += LOWERCASE
  if (useNumbers.value) chars += NUMBERS
  if (useSpace.value) chars += SPACE
  if (useSeparators.value) chars += SEPARATORS
  if (useSpecial.value) chars += SPECIAL

  // Исключаем неоднозначные символы
  if (excludeAmbiguous.value) {
    let filteredChars = ''
    for (let char of chars) {
      if (!AMBIGUOUS.includes(char)) {
        filteredChars += char
      }
    }
    chars = filteredChars
  }

  return chars
})

// Размер набора символов
const charSetSize = computed(() => charSet.value.length)

// Энтропия в битах
const entropyBits = computed(() => {
  if (!passwords.value.length || charSetSize.value === 0) return 0
  return Math.round(Math.log2(Math.pow(charSetSize.value, passwordLength.value)))
})

// Оценка сложности пароля
const passwordStrength = computed(() => {
  const entropy = entropyBits.value
  if (entropy < 30) return 'Очень слабый'
  if (entropy < 40) return 'Слабый'
  if (entropy < 60) return 'Средний'
  if (entropy < 80) return 'Сильный'
  return 'Очень сильный'
})

const strengthClass = computed(() => {
  const strength = passwordStrength.value
  return {
    'text-red-600': strength === 'Очень слабый' || strength === 'Слабый',
    'text-yellow-600': strength === 'Средний',
    'text-green-600': strength === 'Сильный' || strength === 'Очень сильный'
  }
})

// Генерация одного пароля
const generatePassword = () => {
  if (!hasCharSets.value || charSetSize.value === 0) return ''

  let password = ''
  const chars = charSet.value

  for (let i = 0; i < passwordLength.value; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    password += chars[randomIndex]
  }

  return password
}

// Генерация нескольких паролей
const generatePasswords = () => {
  console.log('Generating passwords...', {
    hasCharSets: hasCharSets.value,
    charSetSize: charSetSize.value,
    passwordLength: passwordLength.value,
    passwordCount: passwordCount.value
  })

  if (!hasCharSets.value || charSetSize.value === 0) {
    passwords.value = []
    return
  }

  const newPasswords = []
  for (let i = 0; i < passwordCount.value; i++) {
    newPasswords.push(generatePassword())
  }
  passwords.value = newPasswords
  console.log('Generated passwords:', newPasswords)
}

// Копирование одного пароля
const copyPassword = async (password) => {
  try {
    await navigator.clipboard.writeText(password)
    copied.value = true
    copiedMessage.value = 'Пароль скопирован в буфер обмена!'
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

// Копирование всех паролей
const copyAllPasswords = async () => {
  try {
    await navigator.clipboard.writeText(passwords.value.join('\n'))
    copied.value = true
    copiedMessage.value = 'Все пароли скопированы в буфер обмена!'
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

// Генерация при изменении настроек
watch([passwordLength, passwordCount, useUppercase, useLowercase, useNumbers,
  useSpace, useSeparators, useSpecial, excludeAmbiguous], () => {
  generatePasswords()
})

// Генерация при монтировании компонента
onMounted(() => {
  console.log('Component mounted')
  generatePasswords()
})
</script>