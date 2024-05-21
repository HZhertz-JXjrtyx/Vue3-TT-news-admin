<script setup>
import { onUnmounted } from 'vue'
import { useMessageStore } from '@/stores'
import { clearUnreadApi } from '@/api'
import NavBar from '@/components/NavBar.vue'
import NoticeList from './components/NoticeList.vue'

const props = defineProps({
  noticeType: {
    type: String,
    required: true,
  },
})

const messageStore = useMessageStore()

const title = {
  comment: '回复我的',
  like: '收到的赞',
  follow: '新的关注',
}

onUnmounted(async () => {
  console.log(Object.keys(messageStore.notifyList))
  if (Object.keys(messageStore.notifyList).length) {
    const clearCount = messageStore.notifyList[props.noticeType].unReadCount
    messageStore.notifyList[props.noticeType].unReadCount = 0
    messageStore.unreadCountTotal -= clearCount
  }

  await clearUnreadApi(props.noticeType)
})
</script>
<template>
  <NavBar :title="title[props.noticeType]" />
  <NoticeList :noticeType="noticeType" />
</template>

<style lang="less" scoped></style>
