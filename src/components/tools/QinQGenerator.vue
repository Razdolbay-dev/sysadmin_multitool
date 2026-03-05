<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
        Генератор конфигураций Q-in-Q
      </h3>

      <!-- Форма ввода -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Тип коммутатора
          </label>
          <select
              v-model="selectedSwitchId"
              @change="updateSwitch"
              class="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <optgroup label="DES-3520 серия">
              <option value="3526">DES-3526</option>
              <option value="3528">DES-3528</option>
            </optgroup>
            <optgroup label="DES-3200 серия">
              <option value="3216">DES-3200-16</option>
              <option value="3226">DES-3200-26</option>
              <option value="3228">DES-3200-28</option>
            </optgroup>
            <optgroup label="DES-1228 серия">
              <option value="1228">DES-1228/ME</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            IP адрес
          </label>
          <input
              type="text"
              v-model="ipAddress"
              placeholder="172.30.0.xyz"
              class="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            SNMP Name
          </label>
          <input
              type="text"
              v-model="snmpName"
              placeholder="Gogolya_XX"
              class="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
        </div>

        <div class="flex items-end">
          <button
              @click="generateConfig"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Сгенерировать
          </button>
        </div>
      </div>

      <!-- Результаты -->
      <div v-if="generated" class="space-y-6">
        <!-- Сетка маленьких карточек -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Вход -->
          <ConfigCard
              title="Вход"
              :content="loginConfig"
              @copy="handleCopy"
          />

          <!-- Show VLAN -->
          <ConfigCard
              title="Show VLAN"
              content='show config current_config include "vlan"'
          @copy="handleCopy"
          />

          <!-- RESET -->
          <ConfigCard
              title="RESET"
              content="reset system force_agree\n\n"
              @copy="handleCopy"
          />

          <!-- SNMP шаг 1 -->
          <ConfigCard
              title="SNMP # Шаг 1"
              :content="snmpConfig"
              @copy="handleCopy"
          />

          <!-- IP адрес шаг 3 -->
          <ConfigCard
              title="IP адрес # Шаг 3"
              :content="ipConfig1"
              @copy="handleCopy"
          />

          <!-- IP адрес шаг 4 -->
          <ConfigCard
              title="повторить IP адрес # Шаг 4"
              :content="ipConfig2"
              @copy="handleCopy"
          />
        </div>

        <!-- Основная конфигурация -->
        <ConfigCard
            title="Основная конфигурация"
            :content="mainConfig"
            @copy="handleCopy"
        />

        <!-- Конфигурация транзитных портов (если есть) -->
        <ConfigCard
            v-if="trunkConfig"
            title="Конфигурация транзитных портов"
            :content="trunkConfig"
            @copy="handleCopy"
        >
          <template #subtitle>
            <small class="text-muted">для свича за которым есть свич(и)</small>
          </template>
        </ConfigCard>

        <!-- Информация о прошивке -->
        <ConfigCard
            title="Прошивка"
            :content="firmwareConfig"
            @copy="handleCopy"
        />

        <!-- Блокируемые порты -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Блокируемые порты</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Протокол</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Порт</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in blockedPorts" :key="index">
                <td class="px-3 py-2 text-sm text-gray-900">{{ item.protocol }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">{{ item.port }}</td>
                <td class="px-3 py-2 text-sm text-gray-500">{{ item.description }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Уведомление о копировании -->
      <div v-if="copied" class="mt-3 text-sm text-green-600 flex items-center">
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ copiedMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ConfigCard from './ConfigCard.vue'
import Clipboard from 'clipboard'

// Импортируем данные
import baseConfig from '@/data/config'
import switchModels from '@/data/switches_qinq'
import blockedPortsData from '@/data/blocked-ports.json'

// Реактивные переменные
const selectedSwitchId = ref('3526')
const currentSwitch = ref(switchModels['3526'])
const ipAddress = ref('')
const snmpName = ref('')
const generated = ref(false)
const copied = ref(false)
const copiedMessage = ref('')
const trunkConfig = ref('')

// Блокируемые порты
const blockedPorts = ref(blockedPortsData)

// Вычисляемые свойства
const loginConfig = computed(() => {
  return `${baseConfig.access.user}\n${baseConfig.access.pass}\n\n`
})

const snmpConfig = computed(() => {
  if (!snmpName.value) return ''
  return `config snmp system_name ${snmpName.value}\nconfig snmp system_location ${snmpName.value}\n\n`
})

const ipConfig1 = computed(() => {
  if (!ipAddress.value) return ''
  return `config ipif System vlan MGMT ipaddress ${ipAddress.value}/24 state enable\ncreate iproute default 172.17.17.254 1\n\n`
})

const ipConfig2 = computed(() => {
  if (!ipAddress.value) return ''
  return `${baseConfig.access.user}\n${baseConfig.access.pass}\n\nconfig ipif System vlan MGMT ipaddress ${ipAddress.value}/24 state enable\ncreate iproute default 172.17.17.254 1\n\nsave\n\n`
})

const firmwareConfig = computed(() => {
  return currentSwitch.value.firmware || ''
})

const mainConfig = computed(() => {
  const sw = currentSwitch.value
  const vlan = baseConfig.vlan
  const ntp = baseConfig.server.ntp

  let cfg = `create account admin ${baseConfig.access.user}\n${baseConfig.access.pass}\n${baseConfig.access.pass}\n\n`
  cfg += `config time_zone operator + hour 3 min 0\n`
  cfg += `config dst disable\n`
  cfg += `config sntp primary ${ntp} secondary 0.0.0.0\n`
  cfg += `enable sntp\n\n`

  // Выбираем шаблон в зависимости от типа коммутатора
  switch (sw.template) {
    case '3526':
      cfg += generate3526Config(sw, vlan)
      break
    case '3528':
      cfg += generate3528Config(sw, vlan)
      trunkConfig.value = generateTrunkConfig(sw)
      break
    case '3200':
      cfg += generate3200Config(sw, vlan)
      trunkConfig.value = generateTrunkConfig(sw)
      break
    case '3200-16':
      cfg += generate3200_16Config(sw, vlan)
      break
    case '1228':
      cfg += generate1228Config(sw, vlan)
      trunkConfig.value = generateTrunkConfig(sw)
      break
    default:
      cfg += generate3526Config(sw, vlan)
  }

  return cfg
})

// Функции генерации конфигураций Q-in-Q

const generate3526Config = (sw, vlan) => {
  return `
config pppoe circuit_id_insertion ports 1-${sw.port_count} state disable
config pppoe circuit_id_insertion ports ${sw.port_users} state enable
config pppoe circuit_id_insertion state enable

config traffic_segmentation 1-${sw.port_count} forward ${sw.port_uplink}
config traffic_segmentation ${sw.port_uplink} forward 1-${sw.port_count}

config stp ports ${sw.port_users} state disable
config loopdetect ports all state disable
config loopdetect ports ${sw.port_users} state enable
enable loopdetect


config vlan default delete ${sw.port_users}

create vlan ${vlan} tag ${vlan}
config vlan ${vlan} add untag ${sw.port_users}
config vlan ${vlan} add tag   ${sw.port_other}

create vlan MGMT tag 1000
config vlan MGMT add tagged ${sw.port_other}
config vlan MGMT advertisement disable


config traffic control 1-3 broadcast enable multicast enable threshold 64 action drop

config multicast port_filtering_mode all forward_unreg
config multicast port_filtering_mode ${sw.port_users} filter

config cpu_filter l3_control_pkt 1-${sw.port_count} all state disable
config cpu_filter l3_control_pkt ${sw.port_users} all state enable


disable cpu_interface_filtering

delete cpu access_profile profile_id 5
delete cpu access_profile profile_id 4
delete cpu access_profile profile_id 3
delete cpu access_profile profile_id 2
delete cpu access_profile profile_id 1

create cpu access_profile                              ip destination_ip_mask 224.0.0.0 profile_id 1
config cpu access_profile profile_id 1 add access_id 1 ip destination_ip      224.0.0.0 port ${sw.port_users} deny

enable cpu_interface_filtering


# если делать delete через telnet то свич может отвалится, но потом он появляется уже с ACL
#delete access_profile all

create access_profile                                 ip tcp dst_port_mask 0xffff profile_id 2
config access_profile profile_id 2 add access_id auto ip tcp dst_port         135 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip tcp dst_port         139 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip tcp dst_port         445 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip tcp dst_port         593 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip tcp dst_port        2869 port ${sw.port_users} deny

create access_profile                                 ip udp dst_port_mask 0xffff profile_id 3
config access_profile profile_id 3 add access_id auto ip udp dst_port          68 port ${sw.port_users} deny
config access_profile profile_id 3 add access_id auto ip udp dst_port         137 port ${sw.port_users} deny
config access_profile profile_id 3 add access_id auto ip udp dst_port         138 port ${sw.port_users} deny
config access_profile profile_id 3 add access_id auto ip udp dst_port        1900 port ${sw.port_users} deny
config access_profile profile_id 3 add access_id auto ip udp dst_port        5355 port ${sw.port_users} deny

create access_profile                                 ethernet ethernet_type        profile_id 4
config access_profile profile_id 4 add access_id auto ethernet ethernet_type  0x800 port ${sw.port_users} permit
config access_profile profile_id 4 add access_id auto ethernet ethernet_type  0x806 port ${sw.port_users} permit
config access_profile profile_id 4 add access_id auto ethernet ethernet_type 0x8864 port ${sw.port_users} permit

create access_profile                                 ethernet source_mac 00-00-00-00-00-00 profile_id 5
config access_profile profile_id 5 add access_id auto ethernet source_mac 00-00-00-00-00-00 port ${sw.port_users} deny`
}

const generate3528Config = (sw, vlan) => {
  return `
config pppoe circuit_id_insertion ports 1-${sw.port_count} state disable
config pppoe circuit_id_insertion ports ${sw.port_users} state enable
config pppoe circuit_id_insertion state enable

config traffic_segmentation 1-${sw.port_count} forward ${sw.port_uplink}
config traffic_segmentation ${sw.port_uplink} forward 1-${sw.port_count}

config stp ports ${sw.port_users} state disable
config loopdetect ports all state disable
config loopdetect ports ${sw.port_users} state enable
enable loopdetect


config vlan default delete ${sw.port_users}

create vlan ${vlan} tag ${vlan}
config vlan ${vlan} add untag ${sw.port_users}
config vlan ${vlan} add tag   ${sw.port_other}

create vlan MGMT tag 1000
config vlan MGMT add tagged ${sw.port_other}
config vlan MGMT advertisement disable


config traffic control 1-3 broadcast enable multicast enable threshold 64 action drop

config cpu_filter l3_control_pkt ${sw.port_users} all state enable


disable cpu_interface_filtering

delete cpu access_profile profile_id 5
delete cpu access_profile profile_id 4
delete cpu access_profile profile_id 3
delete cpu access_profile profile_id 2
delete cpu access_profile profile_id 1

enable cpu_interface_filtering

create access_profile profile_id 2 profile_name 2 ip tcp dst_port_mask 0xFFFF
config access_profile profile_id 2 add access_id auto ip tcp dst_port 135 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip tcp dst_port 139 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip tcp dst_port 445 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip tcp dst_port 593 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip tcp dst_port 2869 port ${sw.port_users} deny

create access_profile profile_id 3 profile_name 3 ip udp dst_port_mask 0xffff
config access_profile profile_id 3 add access_id auto ip udp dst_port 68 port ${sw.port_users} deny
config access_profile profile_id 3 add access_id auto ip udp dst_port 137 port ${sw.port_users} deny
config access_profile profile_id 3 add access_id auto ip udp dst_port 138 port ${sw.port_users} deny
config access_profile profile_id 3 add access_id auto ip udp dst_port 1900 port ${sw.port_users} deny
config access_profile profile_id 3 add access_id auto ip udp dst_port 5355 port ${sw.port_users} deny

enable cpu_interface_filtering

enable snmp
enable snmp trap`
}

const generate3200Config = (sw, vlan) => {
  return `
config pppoe circuit_id_insertion ports 1-${sw.port_count} state disable
config pppoe circuit_id_insertion ports ${sw.port_users} state enable
config pppoe circuit_id_insertion state enable

config traffic_segmentation 1-${sw.port_count} forward ${sw.port_uplink}
config traffic_segmentation ${sw.port_uplink} forward 1-${sw.port_count}

config stp ports ${sw.port_users} state disable
config loopdetect ports all state disable
config loopdetect ports ${sw.port_users} state enable
enable loopdetect


config vlan default delete ${sw.port_users}

create vlan ${vlan} tag ${vlan}
config vlan ${vlan} add untag ${sw.port_users}
config vlan ${vlan} add tag   ${sw.port_other}

create vlan MGMT tag 1000
config vlan MGMT add tagged ${sw.port_other}
config vlan MGMT advertisement disable

config traffic control ${sw.port_users} broadcast enable multicast enable threshold 64 action drop

config multicast port_filtering_mode all forward_unreg
config multicast port_filtering_mode ${sw.port_users} filter

config cpu_filter l3_control_pkt 1-${sw.port_count} all state disable
config cpu_filter l3_control_pkt ${sw.port_users} all state enable


disable cpu_interface_filtering

delete cpu access_profile profile_id 5
delete cpu access_profile profile_id 4
delete cpu access_profile profile_id 3
delete cpu access_profile profile_id 2
delete cpu access_profile profile_id 1

create cpu access_profile profile_id 1                 ip destination_ip_mask 224.0.0.0
config cpu access_profile profile_id 1 add access_id 1 ip destination_ip      224.0.0.0 port ${sw.port_users} deny

enable cpu_interface_filtering


delete access_profile all

create access_profile                                 ip tcp dst_port_mask 0xffff profile_id 1
config access_profile profile_id 1 add access_id auto ip tcp dst_port         135 port all deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port         139 port all deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port         445 port all deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port         593 port all deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port        2869 port all deny

create access_profile                                 ip udp dst_port_mask 0xffff profile_id 2
config access_profile profile_id 2 add access_id auto ip udp dst_port          68 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip udp dst_port         137 port all deny
config access_profile profile_id 2 add access_id auto ip udp dst_port         138 port all deny
config access_profile profile_id 2 add access_id auto ip udp dst_port        1900 port all deny
config access_profile profile_id 2 add access_id auto ip udp dst_port        5355 port all deny

create access_profile                                 ethernet ethernet_type        profile_id 3
config access_profile profile_id 3 add access_id auto ethernet ethernet_type  0x800 port all permit
config access_profile profile_id 3 add access_id auto ethernet ethernet_type  0x806 port all permit
config access_profile profile_id 3 add access_id auto ethernet ethernet_type 0x8863 port all permit
config access_profile profile_id 3 add access_id auto ethernet ethernet_type 0x8864 port all permit

create access_profile                                 ethernet source_mac 00-00-00-00-00-00 profile_id 4
config access_profile profile_id 4 add access_id auto ethernet source_mac 00-00-00-00-00-00 port ${sw.port_users} deny`
}

const generate3200_16Config = (sw, vlan) => {
  return `
config pppoe circuit_id_insertion ports 1-${sw.port_count} state disable
config pppoe circuit_id_insertion ports ${sw.port_users} state enable
config pppoe circuit_id_insertion state enable

config traffic_segmentation 1-${sw.port_count} forward ${sw.port_uplink}
config traffic_segmentation ${sw.port_uplink} forward 1-${sw.port_count}

config stp ports ${sw.port_users} state disable
config loopdetect ports all state disable
config loopdetect ports ${sw.port_users} state enable
enable loopdetect


config vlan default delete ${sw.port_users}

create vlan ${vlan} tag ${vlan}
config vlan ${vlan} add untag ${sw.port_users}
config vlan ${vlan} add tag   ${sw.port_other}

create vlan MGMT tag 1000
config vlan MGMT add tagged ${sw.port_other}
config vlan MGMT advertisement disable


config traffic control ${sw.port_users} broadcast enable multicast enable threshold 64 action drop

config multicast filter 1-${sw.port_count} forward
config multicast filter ${sw.port_users} filter


disable cpu_interface_filtering

delete cpu_access_profile profile_id 3
delete cpu_access_profile profile_id 2
delete cpu_access_profile profile_id 1

create cpu_access_profile                              ip destination_ip_mask 224.0.0.0 profile_id 1
config cpu_access_profile profile_id 1 add access_id 1 ip destination_ip      224.0.0.0 port ${sw.port_users} deny

enable cpu_interface_filtering


delete access_profile all

create access_profile                                 ip tcp dst_port_mask 0xffff profile_id 1
config access_profile profile_id 1 add access_id auto ip tcp dst_port         135 port ${sw.port_users} deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port         139 port ${sw.port_users} deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port         445 port ${sw.port_users} deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port         593 port ${sw.port_users} deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port        2869 port ${sw.port_users} deny

create access_profile                                 ip udp dst_port_mask 0xffff profile_id 2
config access_profile profile_id 2 add access_id auto ip udp dst_port          68 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip udp dst_port         137 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip udp dst_port         138 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip udp dst_port        1900 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip udp dst_port        5355 port ${sw.port_users} deny

create access_profile                                 ethernet ethernet_type        profile_id 3
config access_profile profile_id 3 add access_id auto ethernet ethernet_type  0x800 port ${sw.port_users} permit
config access_profile profile_id 3 add access_id auto ethernet ethernet_type  0x806 port ${sw.port_users} permit
config access_profile profile_id 3 add access_id auto ethernet ethernet_type 0x8863 port ${sw.port_users} permit
config access_profile profile_id 3 add access_id auto ethernet ethernet_type 0x8864 port ${sw.port_users} permit

create access_profile                                 ethernet source_mac 00-00-00-00-00-00 profile_id 4
config access_profile profile_id 4 add access_id auto ethernet source_mac 00-00-00-00-00-00 port ${sw.port_users} deny`
}

const generate1228Config = (sw, vlan) => {
  return `
config pppoe circuit_id_insertion ports 1-${sw.port_count} state disable
config pppoe circuit_id_insertion ports ${sw.port_users} state enable
config pppoe circuit_id_insertion state enable

config traffic_segmentation 1-${sw.port_count} forward ${sw.port_uplink}
config traffic_segmentation ${sw.port_uplink} forward 1-${sw.port_count}

config stp ports ${sw.port_users} state disable
config loopdetect ports all state disable
config loopdetect ports ${sw.port_users} state enable
enable loopdetect


config vlan default delete ${sw.port_users}

create vlan ${vlan} tag ${vlan}
config vlan ${vlan} add untag ${sw.port_users}
config vlan ${vlan} add tag   ${sw.port_other}

create vlan MGMT tag 1000
config vlan MGMT add tagged ${sw.port_other}
config vlan MGMT advertisement disable

config traffic control ${sw.port_users} broadcast enable multicast enable threshold 64 action drop

config multicast port_filtering_mode all forward_unreg
config multicast port_filtering_mode ${sw.port_users} filter

config cpu_filter l3_control_pkt 1-${sw.port_count} all state disable
config cpu_filter l3_control_pkt ${sw.port_users} all state enable


disable cpu_interface_filtering

delete cpu access_profile profile_id 5
delete cpu access_profile profile_id 4
delete cpu access_profile profile_id 3
delete cpu access_profile profile_id 2
delete cpu access_profile profile_id 1

create cpu access_profile profile_id 1                 ip destination_ip_mask 224.0.0.0
config cpu access_profile profile_id 1 add access_id 1 ip destination_ip      224.0.0.0 port ${sw.port_users} deny

enable cpu_interface_filtering


delete access_profile all

create access_profile                                 ip tcp dst_port_mask 0xffff profile_id 1
config access_profile profile_id 1 add access_id auto ip tcp dst_port         135 port all deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port         139 port all deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port         445 port all deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port         593 port all deny
config access_profile profile_id 1 add access_id auto ip tcp dst_port        2869 port all deny

create access_profile                                 ip udp dst_port_mask 0xffff profile_id 2
config access_profile profile_id 2 add access_id auto ip udp dst_port          68 port ${sw.port_users} deny
config access_profile profile_id 2 add access_id auto ip udp dst_port         137 port all deny
config access_profile profile_id 2 add access_id auto ip udp dst_port         138 port all deny
config access_profile profile_id 2 add access_id auto ip udp dst_port        1900 port all deny
config access_profile profile_id 2 add access_id auto ip udp dst_port        5355 port all deny

create access_profile                                 ethernet ethernet_type        profile_id 3
config access_profile profile_id 3 add access_id auto ethernet ethernet_type  0x800 port all permit
config access_profile profile_id 3 add access_id auto ethernet ethernet_type  0x806 port all permit
config access_profile profile_id 3 add access_id auto ethernet ethernet_type 0x8863 port all permit
config access_profile profile_id 3 add access_id auto ethernet ethernet_type 0x8864 port all permit

create access_profile                                 ethernet source_mac 00-00-00-00-00-00 profile_id 4
config access_profile profile_id 4 add access_id auto ethernet source_mac 00-00-00-00-00-00 port ${sw.port_users} deny`
}

const generateTrunkConfig = (sw) => {
  return `
enable vlan_trunk
config vlan_trunk ports ${sw.port_other} state enable`
}

// Методы
const updateSwitch = () => {
  currentSwitch.value = switchModels[selectedSwitchId.value] || switchModels['3526']
  trunkConfig.value = ''
}

const generateConfig = () => {
  if (!ipAddress.value || !snmpName.value) {
    alert('Заполните IP адрес и SNMP Name')
    return
  }
  generated.value = true
}

const handleCopy = async (text) => {
  try {
    const clipboard = new Clipboard('.copy-btn', {
      text: () => text
    })

    copied.value = true
    copiedMessage.value = 'Скопировано!'

    setTimeout(() => {
      copied.value = false
      clipboard.destroy()
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
    copied.value = true
    copiedMessage.value = 'Ошибка копирования!'
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// Наблюдаем за изменениями
watch([selectedSwitchId, ipAddress, snmpName], () => {
  generated.value = false
})

// Инициализация
updateSwitch()
</script>