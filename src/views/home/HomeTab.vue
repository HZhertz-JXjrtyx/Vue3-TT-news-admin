<template>
  <div class="home-tab">
    <van-search v-model="value" shape="round" background="#F04142" placeholder="请输入搜索关键词" />
    <van-tabs
      v-model:active="active"
      sticky
      animated
      swipeable
      color="#FF373C"
      title-active-color="#FF373C"
    >
      <van-tab v-for="item in channelStore.userChannel.selected" :key="item.id" :title="item.name">
        <NewsList :channelId="item.channel_id" :channelName="item.name"></NewsList>
      </van-tab>
      <template #nav-bottom>
        <span
          @click="isChannelEditShow = true"
          class="iconfont icon-a-44tubiao-93 container"
        ></span>
      </template>
    </van-tabs>

    <van-popup
      v-model:show="isChannelEditShow"
      position="bottom"
      closeable
      close-icon-position="top-right"
      :style="{ height: '100%' }"
      teleport="body"
      z-index="9999"
      @click-close-icon="onClickCloseIcon"
    >
      <ChannelEdit></ChannelEdit>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore, useChannelStore } from '@/stores'
import NewsList from '@/components/home/NewsList.vue'
import ChannelEdit from '@/components/home/ChannelEdit.vue'

const channelStore = useChannelStore()
const userStore = useUserStore()
const isChannelEditShow = ref(false)
let initialUserChannel = null

console.log(channelStore.userChannel)
if (Object.keys(channelStore.userChannel).length === 0) {
  channelStore.fetchUserChannels()
}
// 监听van-popup打开与关闭
watch(isChannelEditShow, async (newValue) => {
  if (userStore.token) {
    if (newValue) {
      // van-popup打开时，记录userChannel
      initialUserChannel = JSON.parse(JSON.stringify(channelStore.userChannel))
    } else {
      // van-popup关闭时，比较userChannel
      if (JSON.stringify(channelStore.userChannel) !== JSON.stringify(initialUserChannel)) {
        // 如果userChannel有改变，再发起请求
        // 将userChannel转换为只包含id的形式
        const transformedUserChannel = {
          selected: channelStore.userChannel.selected.map((item) => item.id),
          unselected: channelStore.userChannel.unselected.map((item) => item.id)
        }
        // console.log(transformedUserChannel)
        await channelStore.updateUserChannels(transformedUserChannel)
      }
    }
  }
})
</script>
<style lang="less" scoped>
.icon-a-44tubiao-93 {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 44px;
  font-size: 18px;
  background: var(--main-color-white-3);
}
</style>
