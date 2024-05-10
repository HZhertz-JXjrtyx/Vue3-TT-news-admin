import dayjs from 'dayjs'

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

export function convertToMMDDHHmm(value, hasY = false) {
  let date = dayjs.unix(value)
  if (hasY) {
    return date.format('YY-MM-DD HH:mm')
  }
  return date.format('MM-DD HH:mm')
}

export function formatPublishTime(publish_time, isMilli = false) {
  if (!isMilli) {
    publish_time = publish_time * 1000
  }
  const now = new Date()
  const publishDate = new Date(publish_time) // 将时间戳转换为毫秒
  const diffTime = Math.abs(now - publishDate)
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
    return '昨天' + publishDate.getHours() + ':' + publishDate.getMinutes()
  } else if (diffDays === 3) {
    return '前天' + publishDate.getHours() + ':' + publishDate.getMinutes()
  } else if (diffDays <= 10) {
    return diffDays + '天前'
  } else if (publishDate.getFullYear() === now.getFullYear()) {
    return publishDate.getMonth() + 1 + '月' + publishDate.getDate() + '日'
  } else {
    return publishDate.getFullYear() + '年' + (publishDate.getMonth() + 1) + '月'
  }
}

export function formatMessageTime(timestamp) {
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
