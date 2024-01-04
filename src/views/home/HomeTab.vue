<template>
  <div class="home-tab">
    <van-search shape="round" background="#F04142" placeholder="请输入搜索关键词" />

    <van-tabs
      v-model:active="active"
      sticky
      animated
      swipeable
      color="#FF373C"
      title-active-color="#FF373C"
    >
      <van-tab
        v-for="(item, index) in channelStore.userChannel.selected"
        :key="index"
        :title="item.name"
      >
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
      @open="handleOpen"
      @click-close-icon="onClickCloseIcon"
      @close="handleClose"
    >
      <ChannelEdit @switch-channel="onSwitchChannel"></ChannelEdit>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onActivated, onDeactivated } from 'vue'
import { useUserStore, useChannelStore } from '@/stores'
import NewsList from '@/components/home/NewsList.vue'
import ChannelEdit from '@/components/home/ChannelEdit.vue'

const channelStore = useChannelStore()
const userStore = useUserStore()
const active = ref(0)
const isChannelEditShow = ref(false)
let initialUserChannel = null
let initialName = ''
let newIndex = 0

if (Object.keys(channelStore.userChannel).length === 0) {
  channelStore.fetchUserChannels()
}

const onSwitchChannel = (index) => {
  isChannelEditShow.value = false
  active.value = index
}
const onClickCloseIcon = () => {
  // 如果选中频道位置发生变化，根据之前记录的name找到新索引
  newIndex = channelStore.userChannel.selected.findIndex((item) => item.name === initialName)
  active.value = newIndex
}
const handleOpen = () => {
  // van-popup打开时，记录选中频道的name
  initialName = channelStore.userChannel.selected[active.value].name
  // van-popup打开时，记录userChannel
  initialUserChannel = JSON.parse(JSON.stringify(channelStore.userChannel))
}
const handleClose = async () => {
  if (userStore.token) {
    // van-popup关闭时，比较userChannel
    if (JSON.stringify(channelStore.userChannel) !== JSON.stringify(initialUserChannel)) {
      console.log('change')
      // 如果userChannel有改变，再发起请求
      // 将userChannel转换为只包含id的形式
      const transformedUserChannel = {
        selected: channelStore.userChannel.selected.map((item) => item.id),
        unselected: channelStore.userChannel.unselected.map((item) => item.id)
      }
      await channelStore.updateUserChannels(transformedUserChannel)
    }
  }
}

onActivated(() => {
  console.log('组件被重新激活')
})

onDeactivated(() => {
  console.log('组件被缓存')
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
