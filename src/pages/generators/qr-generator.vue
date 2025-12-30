<template>
  <main class="qr-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Генератор QR-кодов онлайн</h1>
      <p class="lead">Создай QR-код для ссылки, текста или Wi-Fi за секунду</p>
    </header>

    <section class="qr-builder">
      <div class="builder-panel">
        <div class="panel-head type-head">
          <div>
            <h2>Тип QR</h2>
            <p>Выбери формат и заполни данные. Код обновится сразу.</p>
          </div>
          <div class="type-badge">6 форматов</div>
        </div>
        <div class="type-tabs" role="tablist" aria-label="Тип QR-кода">
          <button
            v-for="type in qrTypes"
            :key="type.id"
            class="tab"
            :class="{ active: activeType === type.id }"
            type="button"
            role="tab"
            :aria-selected="activeType === type.id"
            @click="activeType = type.id"
          >
            <span class="tab-chip">{{ type.short }}</span>
            <span class="tab-title">{{ type.label }}</span>
            <span class="tab-meta">{{ type.hint }}</span>
          </button>
        </div>

        <div class="form-card">
          <div v-if="activeType === 'link'" class="form-grid">
            <label class="field">
              <span>URL</span>
              <input v-model.trim="linkValue" type="url" placeholder="https://example.com" />
            </label>
          </div>

          <div v-else-if="activeType === 'text'" class="form-grid">
            <label class="field">
              <span>Текст</span>
              <textarea v-model.trim="textValue" rows="4" placeholder="Любой текст"></textarea>
            </label>
          </div>

          <div v-else-if="activeType === 'phone'" class="form-grid">
            <label class="field">
              <span>Телефон</span>
              <input v-model.trim="phoneValue" type="tel" placeholder="+7..." />
            </label>
          </div>

          <div v-else-if="activeType === 'email'" class="form-grid">
            <label class="field">
              <span>Email</span>
              <input v-model.trim="emailValue" type="email" placeholder="hello@example.com" />
            </label>
            <label class="field">
              <span>Тема (опционально)</span>
              <input v-model.trim="emailSubject" type="text" placeholder="Тема письма" />
            </label>
            <label class="field">
              <span>Сообщение (опционально)</span>
              <textarea v-model.trim="emailMessage" rows="3" placeholder="Текст письма"></textarea>
            </label>
          </div>

          <div v-else-if="activeType === 'wifi'" class="form-grid">
            <label class="field">
              <span>SSID</span>
              <input v-model.trim="wifiSsid" type="text" placeholder="Название сети" />
            </label>
            <label class="field">
              <span>Пароль</span>
              <input v-model.trim="wifiPassword" type="text" placeholder="Пароль Wi-Fi" />
            </label>
            <label class="field">
              <span>Тип защиты</span>
              <select v-model="wifiSecurity">
                <option value="WPA">WPA</option>
                <option value="WEP">WEP</option>
                <option value="Open">Open</option>
              </select>
            </label>
          </div>

          <div v-else class="form-grid">
            <label class="field">
              <span>Мессенджер</span>
              <select v-model="messengerType">
                <option value="telegram">Telegram</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </label>
            <label class="field">
              <span>Username или номер</span>
              <input v-model.trim="messengerValue" type="text" placeholder="@username или +7999..." />
            </label>
          </div>
        </div>
      </div>

      <div class="preview-panel">
        <div class="preview-card">
          <div class="preview-head">
            <div>
              <h2>Превью QR</h2>
              <p>Скачай PNG или SVG, либо скопируй изображение.</p>
            </div>
            <button class="btn ghost" type="button" @click="resetAll">Сбросить</button>
          </div>

          <ClientOnly>
            <div class="qr-frame" :style="{ '--qr-size': `${size}px`, '--qr-scale': previewScale }">
              <div class="qr-stage">
                <div ref="qrContainer" class="qr-canvas" :class="{ hidden: isEmpty }"></div>
                <div v-if="isEmpty" class="qr-placeholder">
                  Введите данные, чтобы увидеть QR-код
                </div>
              </div>
            </div>
          </ClientOnly>

          <p class="qr-note">QR-код не хранится и не отправляется на сервер</p>

          <div class="action-row">
            <button class="btn primary" type="button" :disabled="!canDownload" @click="downloadPng">
              Скачать PNG
            </button>
            <button class="btn ghost" type="button" :disabled="!canDownload" @click="downloadSvg">
              Скачать SVG
            </button>
            <button class="btn ghost" type="button" :disabled="!canDownload" @click="copyToClipboard">
              {{ copyLabel }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="settings-card">
      <div class="panel-head">
        <h2>Настройки QR</h2>
        <p>Размер, цвета, отступы и уровень коррекции ошибок.</p>
      </div>
      <div class="settings-grid">
        <label class="field">
          <span>Размер (px)</span>
          <div class="range-row">
            <input
              v-model.number="size"
              type="range"
              min="128"
              max="1024"
              step="8"
              @change="clampSize"
            />
            <input v-model.number="size" type="number" min="128" max="1024" step="1" @change="clampSize" />
          </div>
        </label>
        <label class="field">
          <span>Отступы</span>
          <div class="range-row">
            <input
              v-model.number="margin"
              type="range"
              min="0"
              max="40"
              step="1"
              @change="clampMargin"
            />
            <input v-model.number="margin" type="number" min="0" max="40" step="1" @change="clampMargin" />
          </div>
        </label>
        <label class="field color-field">
          <span>Цвет кода</span>
          <div class="color-row">
            <input v-model="qrColor" class="color-input" type="color" />
            <input v-model="qrColor" class="color-value" type="text" inputmode="text" />
          </div>
        </label>
        <label class="field color-field" :class="{ disabled: transparentBg }">
          <span>Цвет фона</span>
          <div class="color-row">
            <input v-model="bgColor" class="color-input" type="color" :disabled="transparentBg" />
            <input v-model="bgColor" class="color-value" type="text" inputmode="text" :disabled="transparentBg" />
          </div>
        </label>
        <label class="field">
          <span>Уровень коррекции ошибок</span>
          <select v-model="errorCorrection">
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="Q">Q</option>
            <option value="H">H</option>
          </select>
        </label>
        <label class="toggle toggle-inline">
          <input v-model="transparentBg" type="checkbox" />
          <span class="toggle-ui" aria-hidden="true"></span>
          <span>Прозрачный фон</span>
        </label>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Что такое QR-код и зачем он нужен</h2>
        <p>
          QR-код — это компактный способ передать ссылку, текст или контакт одним сканированием. Он убирает лишние
          шаги, ускоряет доступ к информации и позволяет пользователю перейти к действию без ручного ввода.
        </p>

        <h2>Где используют QR-коды</h2>
        <p>
          QR-коды используют в маркетинге, меню ресторанов, визитках, оплате, инструкциях, мероприятиях и онлайн
          продуктах. Это быстрый мост между офлайном и цифровым опытом, который работает на любой камере телефона.
        </p>

        <h2>Как создать QR-код правильно</h2>
        <p>
          Проверь данные, добавь короткий понятный текст, выбери размер и отступы, а затем протестируй сканирование на
          нескольких устройствах. Для печати лучше увеличить размер и использовать высокий уровень коррекции ошибок.
        </p>

        <h2>Цветные и брендированные QR-коды</h2>
        <p>
          Цветные QR-коды работают, если контраст между кодом и фоном остается высоким. Лучше выбирать темный код и
          светлый фон, а для логотипов использовать высокий уровень коррекции, чтобы сканирование оставалось стабильным.
        </p>

        <h2>Ошибки при создании QR</h2>
        <p>
          Самые частые ошибки — слишком маленький размер, слабый контраст и длинный URL без проверки. Всегда тестируй
          QR-код на смартфоне, особенно если он пойдет в печать или рекламу.
        </p>
      </div>
    </section>

    <section class="extras">
      <div class="other-card">
        <h2>Другие генераторы</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/generators/password-generator">
            <span class="other-title">Генератор паролей</span>
            <span class="other-desc">Надежные пароли, оценка силы и копирование одним кликом.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/nicknames">
            <span class="other-title">Генератор никнеймов</span>
            <span class="other-desc">Микс характеров и вайбов для игр, чатов и соцсетей.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/wolf-lorem">
            <span class="other-title">Волчий рыбий текст</span>
            <span class="other-desc">Быстро заполняй макеты абзацами и фразами про волков.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/text-case">
            <span class="other-title">Изменение регистра</span>
            <span class="other-desc">CamelCase, snake_case, Title Case и еще 10 режимов.</span>
          </NuxtLink>
        </div>
      </div>

      <div class="faq-card">
        <h2>FAQ</h2>
        <div class="faq-list">
          <div
            v-for="(item, idx) in faqItems"
            :key="item.q"
            class="faq-item"
            :class="{ open: openFaq === idx }"
          >
            <button class="faq-toggle" type="button" @click="toggleFaq(idx)">
              <span>{{ item.q }}</span>
              <span class="icon">{{ openFaq === idx ? '-' : '+' }}</span>
            </button>
            <div class="faq-body">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type QRCodeStyling from 'qr-code-styling'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { createQrCode, updateQrCode, type QrErrorCorrectionLevel } from '@/utils/qr/generateQr'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Генератор QR-кодов' }
]

const qrTypes = [
  { id: 'link', label: 'Ссылка', short: 'URL', hint: 'Сайт или лендинг' },
  { id: 'text', label: 'Текст', short: 'TXT', hint: 'Заметка или промо' },
  { id: 'phone', label: 'Телефон', short: 'TEL', hint: 'Номер для звонка' },
  { id: 'email', label: 'Email', short: 'MAIL', hint: 'Письмо и тема' },
  { id: 'wifi', label: 'Wi-Fi', short: 'WIFI', hint: 'Сеть и пароль' },
  { id: 'messenger', label: 'Telegram / WhatsApp', short: 'CHAT', hint: 'Username или номер' }
]

const activeType = ref('link')
const linkValue = ref('')
const textValue = ref('')
const phoneValue = ref('')
const emailValue = ref('')
const emailSubject = ref('')
const emailMessage = ref('')
const wifiSsid = ref('')
const wifiPassword = ref('')
const wifiSecurity = ref('WPA')
const messengerType = ref('telegram')
const messengerValue = ref('')

const size = ref(256)
const margin = ref(12)
const qrColor = ref('#0f172a')
const bgColor = ref('#ffffff')
const transparentBg = ref(false)
const errorCorrection = ref<QrErrorCorrectionLevel>('M')

const qrContainer = ref<HTMLElement | null>(null)
const qrInstance = ref<QRCodeStyling | null>(null)

const copyLabel = ref('Скопировать изображение в буфер')
const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const openFaq = ref<number | null>(null)

const escapeWifiValue = (value: string) => value.replace(/([\\;,:])/g, '\\$1')

const buildEmailPayload = () => {
  const address = emailValue.value.trim()
  if (!address) return ''
  const params = new URLSearchParams()
  if (emailSubject.value.trim()) params.set('subject', emailSubject.value.trim())
  if (emailMessage.value.trim()) params.set('body', emailMessage.value.trim())
  const query = params.toString()
  return query ? `mailto:${address}?${query}` : `mailto:${address}`
}

const buildWifiPayload = () => {
  const ssid = wifiSsid.value.trim()
  if (!ssid) return ''
  const security = wifiSecurity.value === 'Open' ? 'nopass' : wifiSecurity.value
  const safeSsid = escapeWifiValue(ssid)
  const safePassword = escapeWifiValue(wifiPassword.value.trim())
  if (wifiSecurity.value === 'Open') {
    return `WIFI:T:${security};S:${safeSsid};;`
  }
  return `WIFI:T:${security};S:${safeSsid};P:${safePassword};;`
}

const buildMessengerPayload = () => {
  const raw = messengerValue.value.trim()
  if (!raw) return ''
  if (messengerType.value === 'telegram') {
    const username = raw.replace(/^@/, '')
    return username ? `https://t.me/${username}` : ''
  }
  const digits = raw.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : ''
}

const qrData = computed(() => {
  switch (activeType.value) {
    case 'link':
      return linkValue.value.trim()
    case 'text':
      return textValue.value.trim()
    case 'phone': {
      const phone = phoneValue.value.trim().replace(/[^\d+]/g, '')
      return phone ? `tel:${phone}` : ''
    }
    case 'email':
      return buildEmailPayload()
    case 'wifi':
      return buildWifiPayload()
    case 'messenger':
      return buildMessengerPayload()
    default:
      return ''
  }
})

const isEmpty = computed(() => !qrData.value)
const canDownload = computed(() => !!qrInstance.value && !isEmpty.value)
const previewScale = computed(() => (size.value > 320 ? 320 / size.value : 1))

const clampSize = () => {
  size.value = Math.min(1024, Math.max(128, Math.round(size.value)))
}

const clampMargin = () => {
  margin.value = Math.min(40, Math.max(0, Math.round(margin.value)))
}

const renderQr = async () => {
  if (typeof window === 'undefined') return
  if (!qrContainer.value) return
  if (isEmpty.value) {
    qrContainer.value.innerHTML = ''
    qrInstance.value = null
    return
  }

  const config = {
    data: qrData.value,
    size: size.value,
    margin: margin.value,
    color: qrColor.value,
    backgroundColor: transparentBg.value ? 'transparent' : bgColor.value,
    errorCorrectionLevel: errorCorrection.value
  }

  if (!qrInstance.value) {
    qrInstance.value = await createQrCode(qrContainer.value, config)
    return
  }
  updateQrCode(qrInstance.value, config)
}

const getQrBlob = async (format: 'png' | 'svg') => {
  if (!qrInstance.value) return null
  try {
    const blob = await qrInstance.value.getRawData(format)
    return blob ?? null
  } catch (err) {
    return null
  }
}

const downloadQr = async (format: 'png' | 'svg') => {
  if (!canDownload.value || typeof document === 'undefined') return
  const blob = await getQrBlob(format)
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = format === 'png' ? 'qr-code.png' : 'qr-code.svg'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const downloadPng = () => downloadQr('png')
const downloadSvg = () => downloadQr('svg')

const copyToClipboard = async () => {
  if (!canDownload.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard || typeof ClipboardItem === 'undefined') {
    copyLabel.value = 'Браузер не поддерживает'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Скопировать изображение в буфер'
    }, 2000)
    return
  }
  const blob = await getQrBlob('png')
  if (!blob) return
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    copyLabel.value = 'Скопировано'
  } catch (err) {
    copyLabel.value = 'Не удалось скопировать'
  }
  if (copyTimer.value) clearTimeout(copyTimer.value)
  copyTimer.value = setTimeout(() => {
    copyLabel.value = 'Скопировать изображение в буфер'
  }, 2000)
}

const resetAll = () => {
  activeType.value = 'link'
  linkValue.value = ''
  textValue.value = ''
  phoneValue.value = ''
  emailValue.value = ''
  emailSubject.value = ''
  emailMessage.value = ''
  wifiSsid.value = ''
  wifiPassword.value = ''
  wifiSecurity.value = 'WPA'
  messengerType.value = 'telegram'
  messengerValue.value = ''
  size.value = 256
  margin.value = 12
  qrColor.value = '#0f172a'
  bgColor.value = '#ffffff'
  transparentBg.value = false
  errorCorrection.value = 'M'
  copyLabel.value = 'Скопировать изображение в буфер'
}

const faqItems = [
  {
    q: 'Можно ли сделать QR для Wi-Fi?',
    a: 'Да, выбери тип Wi-Fi, введи название сети, пароль и тип защиты. QR подключит устройство автоматически.'
  },
  {
    q: 'Работает ли цветной QR?',
    a: 'Да, если контраст между кодом и фоном остается высоким. Лучше избегать светлых кодов на светлом фоне.'
  },
  {
    q: 'Можно ли скачать в SVG?',
    a: 'Да, генератор делает SVG сразу. Это удобно для печати, макетов и дизайна.'
  },
  {
    q: 'Безопасно ли создавать QR онлайн?',
    a: 'Генерация идет прямо в браузере. Данные не отправляются на сервер и не сохраняются.'
  },
  {
    q: 'Истекает ли QR-код со временем?',
    a: 'QR-код не истекает, если данные внутри актуальны. Ссылка или контакт будут работать, пока они активны.'
  },
  {
    q: 'Поддерживаются ли мессенджеры?',
    a: 'Да, в режиме Telegram / WhatsApp можно создать QR для username или номера.'
  }
]

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

watch(
  [qrData, size, margin, qrColor, bgColor, errorCorrection, transparentBg],
  async () => {
    await nextTick()
    await renderQr()
  },
  { immediate: true }
)

onMounted(() => {
  nextTick(() => {
    renderQr()
  })
})

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/qr-generator`)
const metaDescription =
  'Создай QR-код для ссылки, Wi-Fi, телефона или текста. Скачать PNG или SVG бесплатно.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Генератор QR-кодов онлайн',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      url: canonicalUrl.value,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a }
      }))
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${requestUrl.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Генераторы', item: `${requestUrl.origin}/generators` },
        { '@type': 'ListItem', position: 3, name: 'Генератор QR-кодов', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Генератор QR-кодов онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Генератор QR-кодов онлайн | Neural Wise Wolf',
  ogDescription: metaDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
}))

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ]
}))
</script>

<style scoped>
.qr-page {
  display: grid;
  gap: clamp(24px, 3vw, 42px);
  width: min(1180px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 32px) 0 clamp(36px, 4vw, 68px);
  position: relative;
}

.hero {
  text-align: center;
  display: grid;
  gap: 12px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(32px, 5.6vw, 52px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
}

.hero .lead {
  margin: 0;
  max-width: 720px;
  color: #cbd5f5;
}

.qr-builder {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(16px, 2.6vw, 28px);
}

.builder-panel,
.preview-card,
.settings-card,
.seo-card,
.other-card,
.faq-card {
  background: radial-gradient(circle at top, rgba(14, 116, 144, 0.12), transparent 55%),
    linear-gradient(150deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.5));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(18px, 2.6vw, 28px);
  display: grid;
  gap: 18px;
}

.panel-head h2,
.preview-head h2 {
  margin: 0 0 6px;
}

.panel-head p,
.preview-head p {
  margin: 0;
  color: #94a3c9;
}

.type-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 16px;
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.12), rgba(15, 23, 42, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.type-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0b1b2b;
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.85), rgba(14, 116, 144, 0.7));
  border: 1px solid rgba(56, 189, 248, 0.4);
  white-space: nowrap;
}

.type-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.tab {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.55);
  color: #e2e8f0;
  padding: 14px 14px 12px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  text-align: left;
  display: grid;
  gap: 6px;
  min-height: 92px;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.tab.active {
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.2), rgba(14, 116, 144, 0.35));
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 12px 24px rgba(14, 116, 144, 0.25);
}

.tab:hover:not(.active) {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.5);
}

.tab-chip {
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0b1b2b;
  background: rgba(56, 189, 248, 0.8);
}

.tab-title {
  font-size: 16px;
}

.tab-meta {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.tab.active .tab-chip {
  background: rgba(255, 255, 255, 0.9);
}

.tab.active .tab-meta {
  color: #e0f2fe;
}

.form-card {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.55);
  padding: 16px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 8px;
  color: #e2e8f0;
  font-weight: 600;
}

.field span {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #cbd5e1;
}

input,
textarea,
select {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(15, 23, 42, 0.6);
  color: #fff;
  padding: 10px 12px;
  outline: none;
  font-weight: 600;
  font-family: inherit;
}

textarea {
  resize: vertical;
}

.preview-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.qr-frame {
  border-radius: 18px;
  border: 1px dashed rgba(148, 163, 184, 0.35);
  background: rgba(2, 6, 23, 0.5);
  padding: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 260px;
}

.qr-stage {
  position: relative;
  width: calc(var(--qr-size) * var(--qr-scale));
  height: calc(var(--qr-size) * var(--qr-scale));
}

.qr-canvas {
  width: var(--qr-size);
  height: var(--qr-size);
  transform: scale(var(--qr-scale));
  transform-origin: top left;
}

.qr-canvas.hidden {
  visibility: hidden;
}

.qr-placeholder {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: repeating-linear-gradient(
    45deg,
    rgba(15, 23, 42, 0.6),
    rgba(15, 23, 42, 0.6) 8px,
    rgba(30, 41, 59, 0.6) 8px,
    rgba(30, 41, 59, 0.6) 16px
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
  text-align: center;
  padding: 12px;
  color: #cbd5f5;
  font-weight: 700;
}

.qr-note {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.settings-card {
  display: grid;
  gap: 16px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  align-items: stretch;
}

.range-row {
  display: grid;
  grid-template-columns: 1fr 90px;
  gap: 12px;
  align-items: center;
}

.color-field {
  gap: 10px;
}

.color-row {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 10px;
  align-items: center;
}

.color-input {
  width: 52px;
  height: 44px;
  padding: 0;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(15, 23, 42, 0.6);
  cursor: pointer;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 6px;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 8px;
}

.color-value {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.toggle {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  align-items: center;
  color: #e2e8f0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px 12px;
  height: fit-content;
}

.toggle-inline {
  align-self: end;
}

.toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.toggle-ui {
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
  position: relative;
  transition: background 0.2s ease;
}

.toggle-ui::after {
  content: '';
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 3px;
  left: 4px;
  transition: transform 0.2s ease;
}

.toggle input:checked + .toggle-ui {
  background: rgba(56, 189, 248, 0.7);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
}

.field.disabled {
  opacity: 0.55;
}

.btn {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.6);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn.primary {
  background: linear-gradient(130deg, rgba(56, 189, 248, 0.9), rgba(14, 116, 144, 0.8));
  border: none;
  color: #041019;
}

.btn.ghost {
  background: rgba(15, 23, 42, 0.55);
}

.seo-text h2 {
  margin: 0 0 8px;
}

.seo-text p {
  margin: 0 0 14px;
  color: #cbd5e1;
}

.extras {
  display: grid;
  gap: clamp(16px, 3vw, 24px);
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.other-link {
  text-decoration: none;
  color: inherit;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  padding: 14px;
  display: grid;
  gap: 6px;
  transition: transform 0.12s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.other-link:hover {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.5);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.4);
}

.other-title {
  font-weight: 800;
}

.other-desc {
  color: #94a3b8;
  font-size: 13px;
}

.faq-list {
  display: grid;
  gap: 10px;
}

.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.faq-item.open {
  border-color: rgba(56, 189, 248, 0.45);
  background: rgba(255, 255, 255, 0.04);
}

.faq-toggle {
  width: 100%;
  border: none;
  background: transparent;
  color: #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  cursor: pointer;
  font-weight: 700;
  text-align: left;
}

.faq-toggle .icon {
  font-size: 18px;
}

.faq-body {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  padding: 0 14px;
}

.faq-item.open .faq-body {
  max-height: 220px;
  opacity: 1;
  padding-bottom: 12px;
}

.faq-body p {
  margin: 0;
  color: #cbd5e1;
}

@media (max-width: 980px) {
  .qr-builder {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .preview-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .range-row {
    grid-template-columns: 1fr 70px;
  }

  .color-row {
    grid-template-columns: 44px 1fr;
  }

  .qr-frame {
    min-height: 220px;
  }

  .type-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .tab {
    min-height: 84px;
  }
}
</style>
