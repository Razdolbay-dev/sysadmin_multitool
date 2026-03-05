<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        IP калькулятор
      </h3>

      <!-- Ввод IP и маски -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            IP адрес (без маски)
          </label>
          <div class="flex rounded-md shadow-sm">
            <input
                type="text"
                v-model="ipAddress"
                @input="calculate"
                placeholder="100.64.0.0"
                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Маска подсети
          </label>
          <div class="flex space-x-2">
            <input
                type="number"
                v-model.number="cidr"
                @input="calculate"
                min="0"
                max="32"
                class="w-20 block px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            <select
                v-model.number="cidr"
                @change="calculate"
                class="block flex-1 px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="32">/32 (255.255.255.255) - 1 адрес</option>
              <option value="31">/31 (255.255.255.254) - 2 адреса</option>
              <option value="30">/30 (255.255.255.252) - 4 адреса</option>
              <option value="29">/29 (255.255.255.248) - 8 адресов</option>
              <option value="28">/28 (255.255.255.240) - 16 адресов</option>
              <option value="27">/27 (255.255.255.224) - 32 адреса</option>
              <option value="26">/26 (255.255.255.192) - 64 адреса</option>
              <option value="25">/25 (255.255.255.128) - 128 адресов</option>
              <option value="24">/24 (255.255.255.0) - 256 адресов</option>
              <option value="23">/23 (255.255.254.0) - 512 адресов</option>
              <option value="22">/22 (255.255.252.0) - 1024 адреса</option>
              <option value="21">/21 (255.255.248.0) - 2048 адресов</option>
              <option value="20">/20 (255.255.240.0) - 4096 адресов</option>
              <option value="19">/19 (255.255.224.0) - 8192 адреса</option>
              <option value="18">/18 (255.255.192.0) - 16384 адреса</option>
              <option value="17">/17 (255.255.128.0) - 32768 адресов</option>
              <option value="16">/16 (255.255.0.0) - 65536 адресов</option>
              <option value="15">/15 (255.254.0.0) - 131072 адреса</option>
              <option value="14">/14 (255.252.0.0) - 262144 адреса</option>
              <option value="13">/13 (255.248.0.0) - 524288 адресов</option>
              <option value="12">/12 (255.240.0.0) - 1048576 адресов</option>
              <option value="11">/11 (255.224.0.0) - 2097152 адреса</option>
              <option value="10">/10 (255.192.0.0) - 4194304 адреса</option>
              <option value="9">/9 (255.128.0.0) - 8388608 адресов</option>
              <option value="8">/8 (255.0.0.0) - 16777216 адресов</option>
              <option value="7">/7 (254.0.0.0) - 33554432 адреса</option>
              <option value="6">/6 (252.0.0.0) - 67108864 адреса</option>
              <option value="5">/5 (248.0.0.0) - 134217728 адресов</option>
              <option value="4">/4 (240.0.0.0) - 268435456 адресов</option>
              <option value="3">/3 (224.0.0.0) - 536870912 адресов</option>
              <option value="2">/2 (192.0.0.0) - 1073741824 адреса</option>
              <option value="1">/1 (128.0.0.0) - 2147483648 адресов</option>
              <option value="0">/0 (0.0.0.0) - 4294967296 адресов</option>
            </select>
          </div>
          <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
        </div>
      </div>

      <!-- Результаты -->
      <div v-if="result" class="mt-8 border-t border-gray-200 pt-6">
        <h4 class="text-md font-medium text-gray-900 mb-4">Результаты расчета</h4>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Основная информация -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h5 class="text-sm font-medium text-gray-700 mb-3">Информация о сети</h5>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">IP адрес:</dt>
                <dd class="text-sm font-mono text-gray-900">{{ result.ipAddress }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Адрес сети:</dt>
                <dd class="text-sm font-mono text-gray-900">{{ result.networkAddress }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Широковещательный адрес:</dt>
                <dd class="text-sm font-mono text-gray-900">{{ result.broadcastAddress }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Маска:</dt>
                <dd class="text-sm font-mono text-gray-900">{{ result.subnetMask }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Wildcard маска:</dt>
                <dd class="text-sm font-mono text-gray-900">{{ result.wildcardMask }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">CIDR:</dt>
                <dd class="text-sm font-mono text-gray-900">/{{ result.cidr }}</dd>
              </div>
            </dl>
          </div>

          <!-- Информация о хостах -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h5 class="text-sm font-medium text-gray-700 mb-3">Информация о хостах</h5>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Всего адресов:</dt>
                <dd class="text-sm font-mono text-gray-900">{{ formatNumber(result.totalHosts) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Доступно хостов:</dt>
                <dd class="text-sm font-mono text-gray-900">{{ formatNumber(result.usableHosts) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Первый хост:</dt>
                <dd class="text-sm font-mono text-gray-900">{{ result.firstHost }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Последний хост:</dt>
                <dd class="text-sm font-mono text-gray-900">{{ result.lastHost }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Разбивка на подсети (показываем только если маска < 32) -->
        <div v-if="result && result.cidr < 32" class="mt-8 border-t border-gray-200 pt-6">
          <h4 class="text-md font-medium text-gray-900 mb-4">Разбивка на подсети</h4>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Разбить на подсети с маской
              </label>
              <select
                  v-model.number="selectedSubnetMask"
                  class="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>Выберите маску</option>
                <option
                    v-for="mask in availableMasks"
                    :key="mask"
                    :value="mask"
                >
                  /{{ mask }} — {{ getMaskDescription(mask) }}
                </option>
              </select>
            </div>

            <div class="flex items-end">
              <button
                  @click="calculateSubnets"
                  :disabled="!selectedSubnetMask"
                  class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Рассчитать разбивку
              </button>
            </div>

            <div class="flex items-end justify-end">
              <button
                  @click="clearSubnets"
                  class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Очистить
              </button>
            </div>
          </div>

          <!-- Информация о выбранной маске -->
          <div v-if="selectedSubnetMask" class="mb-4 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="font-medium">Выбрана маска /{{ selectedSubnetMask }}</p>
            <p class="text-xs mt-1">
              Каждая подсеть будет содержать {{ formatNumber(Math.pow(2, 32 - selectedSubnetMask)) }} IP адресов
              ({{ formatNumber(getUsableHosts(selectedSubnetMask)) }} хостов).
              Всего подсетей: {{ Math.pow(2, selectedSubnetMask - result.cidr) }}
            </p>
          </div>

          <!-- Таблица с подсетями -->
          <div v-if="subnets && subnets.length > 0" class="overflow-x-auto mt-4">
            <div class="mb-2 text-sm text-gray-600">
              Всего подсетей: <span class="font-medium">{{ subnets.length }}</span>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Адрес сети</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Диапазон хостов</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Широковещ.</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Маска</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Всего IP</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хостов</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(subnet, index) in subnets" :key="index">
                <td class="px-3 py-2 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-3 py-2 text-sm font-mono text-gray-900">{{ subnet.network }}</td>
                <td class="px-3 py-2 text-sm font-mono text-gray-900">
                  <span v-if="subnet.cidr < 31">{{ subnet.firstHost }} — {{ subnet.lastHost }}</span>
                  <span v-else-if="subnet.cidr === 31">Точка-точка (нет broadcast)</span>
                  <span v-else>Только хост</span>
                </td>
                <td class="px-3 py-2 text-sm font-mono text-gray-900">
                  <span v-if="subnet.cidr < 31">{{ subnet.broadcast }}</span>
                  <span v-else>N/A</span>
                </td>
                <td class="px-3 py-2 text-sm font-mono text-gray-900">/{{ subnet.cidr }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">{{ formatNumber(subnet.totalHosts) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">{{ formatNumber(subnet.usableHosts) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="selectedSubnetMask && subnets.length === 0" class="text-sm text-gray-500 text-center py-4">
            Нажмите "Рассчитать разбивку" для отображения подсетей
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="mt-6 flex space-x-3">
          <button
              @click="copyResults"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Копировать результаты
          </button>
          <button
              @click="reset"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Сбросить
          </button>
        </div>

        <div v-if="copied" class="mt-2 text-sm text-green-600">
          Результаты скопированы в буфер обмена!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const ipAddress = ref('100.64.0.0')
const cidr = ref(20)
const error = ref('')
const result = ref(null)
const copied = ref(false)
const selectedSubnetMask = ref('')
const subnets = ref([])

// Форматирование больших чисел
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Доступные маски для разбивки (от текущей+1 до 32)
const availableMasks = computed(() => {
  if (!result.value || !result.value.cidr) return []

  const masks = []
  for (let i = result.value.cidr + 1; i <= 32; i++) {
    masks.push(i)
  }
  return masks
})

// Валидация IPv4 адреса
const isValidIPv4 = (ip) => {
  if (!ip) return false
  const parts = ip.split('.')
  if (parts.length !== 4) return false

  return parts.every(part => {
    const num = parseInt(part, 10)
    return num >= 0 && num <= 255 && part === num.toString()
  })
}

// Конвертация CIDR в маску
const cidrToMask = (cidr) => {
  cidr = parseInt(cidr)
  const mask = []

  for (let i = 0; i < 4; i++) {
    if (cidr >= 8) {
      mask.push(255)
      cidr -= 8
    } else if (cidr > 0) {
      mask.push(256 - Math.pow(2, 8 - cidr))
      cidr = 0
    } else {
      mask.push(0)
    }
  }

  return mask.join('.')
}

// Получение описания маски
const getMaskDescription = (mask) => {
  const totalIPs = Math.pow(2, 32 - mask)
  const usableHosts = getUsableHosts(mask)

  if (mask === 32) return '1 IP (только хост)'
  if (mask === 31) return '2 IP (точка-точка)'
  return `${formatNumber(totalIPs)} IP (${formatNumber(usableHosts)} хостов)`
}

// Получение количества хостов для маски
const getUsableHosts = (mask) => {
  const totalIPs = Math.pow(2, 32 - mask)
  if (mask < 31) return totalIPs - 2
  return totalIPs
}

// Расчет подсети
const calculate = () => {
  error.value = ''

  if (!ipAddress.value) {
    error.value = 'Введите IP адрес'
    return
  }

  if (!isValidIPv4(ipAddress.value)) {
    error.value = 'Некорректный IPv4 адрес'
    return
  }

  try {
    // Конвертируем IP в число
    const ipParts = ipAddress.value.split('.').map(Number)
    const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]

    // Создаем маску
    const maskNum = cidr.value === 32 ? 0xFFFFFFFF : ~((1 << (32 - cidr.value)) - 1) >>> 0

    // Вычисляем сеть
    const networkNum = ipNum & maskNum

    // Вычисляем широковещательный адрес
    const broadcastNum = networkNum | ~maskNum >>> 0

    // Конвертируем числа обратно в IP
    const network = [
      (networkNum >>> 24) & 255,
      (networkNum >>> 16) & 255,
      (networkNum >>> 8) & 255,
      networkNum & 255
    ].join('.')

    const broadcast = [
      (broadcastNum >>> 24) & 255,
      (broadcastNum >>> 16) & 255,
      (broadcastNum >>> 8) & 255,
      broadcastNum & 255
    ].join('.')

    const subnetMaskStr = cidrToMask(cidr.value)

    // Wildcard маска
    const wildcardParts = subnetMaskStr.split('.').map(octet => 255 - parseInt(octet))
    const wildcardMask = wildcardParts.join('.')

    // Первый и последний хост
    let firstHost = 'N/A'
    let lastHost = 'N/A'

    if (cidr.value < 31) {
      const firstHostNum = networkNum + 1
      const lastHostNum = broadcastNum - 1

      firstHost = [
        (firstHostNum >>> 24) & 255,
        (firstHostNum >>> 16) & 255,
        (firstHostNum >>> 8) & 255,
        firstHostNum & 255
      ].join('.')

      lastHost = [
        (lastHostNum >>> 24) & 255,
        (lastHostNum >>> 16) & 255,
        (lastHostNum >>> 8) & 255,
        lastHostNum & 255
      ].join('.')
    } else if (cidr.value === 31) {
      firstHost = network
      lastHost = broadcast
    }

    // Количество хостов
    const totalHosts = Math.pow(2, 32 - cidr.value)
    const usableHosts = cidr.value < 31 ? totalHosts - 2 : totalHosts

    result.value = {
      ipAddress: ipAddress.value,
      networkAddress: network,
      broadcastAddress: broadcast,
      subnetMask: subnetMaskStr,
      wildcardMask: wildcardMask,
      cidr: cidr.value,
      totalHosts: totalHosts,
      usableHosts: usableHosts,
      firstHost: firstHost,
      lastHost: lastHost
    }

    // Сбрасываем подсети при изменении основной сети
    clearSubnets()

  } catch (e) {
    error.value = 'Ошибка при расчете: ' + e.message
    console.error(e)
  }
}

// Расчет подсетей по маске
const calculateSubnets = () => {
  if (!result.value || !selectedSubnetMask.value || selectedSubnetMask.value <= result.value.cidr) {
    subnets.value = []
    return
  }

  try {
    const subList = []
    const step = Math.pow(2, 32 - selectedSubnetMask.value)
    const networkNum = ipToNumber(result.value.networkAddress)
    const totalSubnets = Math.pow(2, selectedSubnetMask.value - result.value.cidr)

    for (let i = 0; i < totalSubnets; i++) {
      const currentNetwork = networkNum + (i * step)
      const broadcastNum = currentNetwork + step - 1

      const network = numberToIp(currentNetwork)
      const broadcast = numberToIp(broadcastNum)

      let firstHost = 'N/A'
      let lastHost = 'N/A'

      if (selectedSubnetMask.value < 31) {
        firstHost = numberToIp(currentNetwork + 1)
        lastHost = numberToIp(broadcastNum - 1)
      } else if (selectedSubnetMask.value === 31) {
        firstHost = network
        lastHost = broadcast
      }

      subList.push({
        network,
        broadcast,
        firstHost,
        lastHost,
        cidr: selectedSubnetMask.value,
        totalHosts: step,
        usableHosts: getUsableHosts(selectedSubnetMask.value)
      })
    }

    subnets.value = subList
  } catch (e) {
    console.error('Ошибка при расчете подсетей:', e)
    subnets.value = []
  }
}

// Очистка подсетей
const clearSubnets = () => {
  subnets.value = []
  selectedSubnetMask.value = ''
}

// Вспомогательные функции для конвертации IP
const ipToNumber = (ip) => {
  const parts = ip.split('.').map(Number)
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]
}

const numberToIp = (num) => {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ].join('.')
}

// Копирование результатов
const copyResults = async () => {
  if (!result.value) return

  let text = `IP адрес: ${result.value.ipAddress}
Адрес сети: ${result.value.networkAddress}
Широковещательный адрес: ${result.value.broadcastAddress}
Маска подсети: ${result.value.subnetMask}
Wildcard маска: ${result.value.wildcardMask}
CIDR: /${result.value.cidr}
Всего адресов: ${result.value.totalHosts}
Доступно хостов: ${result.value.usableHosts}
Первый хост: ${result.value.firstHost}
Последний хост: ${result.value.lastHost}`

  if (subnets.value && subnets.value.length > 0) {
    text += `\n\nРазбивка на подсети /${selectedSubnetMask.value} (всего ${subnets.value.length} подсетей):\n`
    subnets.value.forEach((subnet, i) => {
      text += `\n${i+1}. ${subnet.network}/${subnet.cidr}`
      if (subnet.cidr < 31) {
        text += ` (хосты: ${subnet.firstHost} — ${subnet.lastHost})`
      }
    })
  }

  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const reset = () => {
  ipAddress.value = '100.64.0.0'
  cidr.value = 20
  clearSubnets()
  error.value = ''
  result.value = null
  calculate()
}

// Начальный расчет при монтировании компонента
onMounted(() => {
  calculate()
})

// Наблюдаем за изменениями
watch([ipAddress, cidr], () => {
  // Принудительно преобразуем cidr в число
  cidr.value = Number(cidr.value)
  calculate()
})
</script>