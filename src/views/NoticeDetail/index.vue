<script setup>
import NavBar from '@/components/NavBar.vue'
import NoticeList from './components/NoticeList.vue'

const props = defineProps({
  noticeType: {
    type: String,
    required: true,
  },
})

const title = {
  comment: '回复我的',
  like: '收到的赞',
  follow: '新的关注',
}
</script>
<template>
  <NavBar :title="title[props.noticeType]" />
  <NoticeList :noticeType="noticeType" />
</template>

<style lang="less" scoped></style>
