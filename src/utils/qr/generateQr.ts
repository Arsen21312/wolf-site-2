import type QRCodeStyling from 'qr-code-styling'
import type { Options } from 'qr-code-styling'

export type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export type QrConfig = {
  data: string
  size: number
  margin: number
  color: string
  backgroundColor: string
  errorCorrectionLevel: QrErrorCorrectionLevel
}

const buildOptions = (config: QrConfig): Options => ({
  width: config.size,
  height: config.size,
  type: 'svg',
  data: config.data,
  margin: config.margin,
  qrOptions: { errorCorrectionLevel: config.errorCorrectionLevel },
  dotsOptions: { color: config.color, type: 'rounded' },
  backgroundOptions: { color: config.backgroundColor }
})

let QRCodeStylingConstructor: typeof import('qr-code-styling').default | null = null

const loadQrStyling = async () => {
  if (!QRCodeStylingConstructor) {
    const module = await import('qr-code-styling')
    QRCodeStylingConstructor = module.default
  }
  return QRCodeStylingConstructor
}

export const createQrCode = async (container: HTMLElement, config: QrConfig) => {
  const QRCodeStylingClass = await loadQrStyling()
  const instance = new QRCodeStylingClass(buildOptions(config))
  instance.append(container)
  return instance
}

export const updateQrCode = (instance: QRCodeStyling, config: QrConfig) => {
  instance.update(buildOptions(config))
}
