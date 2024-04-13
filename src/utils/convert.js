import dayjs from 'dayjs'

export function formatCount(count) {
  if (count > 10000) {
    return (count / 10000).toFixed(1) + '万'
  } else {
    return count.toString()
  }
}

export function convertToMMSS(value) {
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
