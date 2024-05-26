import { MTE } from '@/assets/js'

export function base64ToFile(base64, fileName) {
  let arr = base64.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  const extension = MTE[mime] || 'unknown' // 获取文件后缀
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const blob = new Blob([u8arr], { type: mime })
  return new File([blob], fileName + '.' + extension, { type: mime })
}
