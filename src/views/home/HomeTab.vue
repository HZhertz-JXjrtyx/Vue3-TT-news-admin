<template>
  <div class="hometab">
    <van-search v-model="value" shape="round" background="#f04142" placeholder="请输入搜索关键词" />
    <van-tabs
      v-model:active="active"
      sticky
      animated
      swipeable
      color="#f04142"
      title-active-color="#f04142"
    >
      <van-tab v-for="item in channelStore.userChannel.selected" :key="item.id" :title="item.name">
        <NewsList :channelId="item.channel_id" :channelName="item.name"></NewsList>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { useChannelStore } from '@/stores'
import { getLocal } from '@/utils/storage'
import NewsList from '@/components/home/NewsList.vue'

const channelStore = useChannelStore()
if (!getLocal('CHANNEL') || getLocal('CHANNEL').userChannel.length === 0) {
  channelStore.fetchUserChannels()
}
</script>
<style lang="less" scoped></style>
