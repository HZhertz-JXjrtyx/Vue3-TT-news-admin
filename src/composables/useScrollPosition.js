// import { ref, watch } from 'vue'

// const useScrollPosition = (channelId, activeTab) => {
//   const scrollPositions = ref(JSON.parse(sessionStorage.getItem('scrollPositions')) || {})
//   let previousTab = null

//   watch(
//     activeTab,
//     (newTab, oldTab) => {
//       // 保存离开的tab页的位置
//       if (previousTab !== null) {
//         console.log(window.scrollY)
//         // window.scrollY ||document.documentElement.scrollTop ||
//         const scrollTop = document.body.scrollTop || 0
//         scrollPositions.value[previousTab] = scrollTop
//         sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions.value))
//       }

//       // 恢复要进入的tab页的位置
//       const scrollTop = scrollPositions.value[newTab] || 0
//       window.scrollTo(0, scrollTop)

//       previousTab = newTab
//     },
//     { immediate: true }
//   )

//   return {
//     scrollPositions,
//   }
// }

// export default useScrollPosition
