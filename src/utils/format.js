export function formatCount(count) {
  if (count > 10000) {
    return (count / 10000).toFixed(1) + '万'
  } else {
    return count.toString()
  }
}

export function formatVideoDuration(value) {
  let minutes = Math.floor(value / 60)
  let seconds = Math.round(value % 60)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

export function formatTimeRoughly(timestamp) {
  const now = new Date()
  const date = new Date(timestamp)
  const diffTime = Math.abs(now - date)
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffMinutes < 10) {
    return '刚刚'
  } else if (diffMinutes < 60) {
    return diffMinutes + '分钟前'
  } else if (diffHours < 24) {
    return diffHours + '小时前'
  } else if (diffDays === 2) {
    return '昨天' + date.getHours() + ':' + date.getMinutes()
  } else if (diffDays === 3) {
    return '前天' + date.getHours() + ':' + date.getMinutes()
  } else if (diffDays <= 10) {
    return diffDays + '天前'
  } else if (date.getFullYear() === now.getFullYear()) {
    return date.getMonth() + 1 + '月' + date.getDate() + '日'
  } else {
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
  }
}

export function formatTimeAccurately(timestamp) {
  const now = new Date()
  const date = new Date(timestamp)

  const isSameDay = now.toDateString() === date.toDateString()
  const isSameYear = now.getFullYear() === date.getFullYear()

  const zeroPad = (num) => String(num).padStart(2, '0')

  const hhmm = `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`
  const mmdd = `${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())} ${hhmm}`
  const yyyymmdd = `${date.getFullYear()}-${mmdd}`

  if (isSameDay) {
    return hhmm
  } else if (isSameYear) {
    return mmdd
  } else {
    return yyyymmdd
  }
}
