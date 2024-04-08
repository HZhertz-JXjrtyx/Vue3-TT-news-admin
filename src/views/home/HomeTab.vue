<script setup>
import { ref, watchEffect, onActivated, onDeactivated, watch, onMounted, nextTick } from 'vue'
import { useUserStore, useChannelStore } from '@/stores'
import NewsList from '@/components/home/NewsList.vue'
import ChannelEdit from '@/components/home/ChannelEdit.vue'

const channelStore = useChannelStore()
const userStore = useUserStore()

const active = ref(0)
const tabsKey = ref(0)

const list = ref([])
watch(
  channelStore.userChannel,
  (nv) => {
    list.value = nv.selected
    tabsKey.value++
  },
  {
    deep: true,
    immediate: true,
  }
)

watchEffect(() => {
  if (channelStore.userChannel.selected?.length + channelStore.userChannel.unselected?.length !== 16) {
    channelStore.fetchUserChannels()
  }
})

const isChannelEditShow = ref(false)
let initialUserChannel = null
const handleOpen = () => {
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
        unselected: channelStore.userChannel.unselected.map((item) => item.id),
      }
      await channelStore.updateUserChannels(transformedUserChannel)
    }
  }
  scrollTo()
}

const onSwitchChannel = (index) => {
  isChannelEditShow.value = false
  active.value = index
  scrollTo()
}

const scrollPositions = ref(JSON.parse(sessionStorage.getItem('scrollPositions')) || {})
const handleScroll = (e) => {
  console.log(e.target.scrollTop)
  scrollPositions.value[active.value] = e.target.scrollTop
  sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions.value))
}

const scrollTo = () => {
  const scrollTop = scrollPositions.value[active.value] || 0
  nextTick(() => {
    if (scrollContainers.value[active.value]) {
      scrollContainers.value[active.value].scrollTop = scrollTop
    }
  })
}

const scrollContainers = ref({})
onMounted(() => {
  console.log('onMounted')
  sessionStorage.removeItem('scrollPositions')
  scrollPositions.value = {}
  list.value.forEach((item) => {
    scrollContainers.value[item.id] = ref(null)
  })
  console.log(scrollContainers.value)
})
const handleChange = (name, title) => {
  console.log(name, title)
  scrollTo()
}

onActivated(() => {
  console.log('组件被重新激活')
  scrollTo()
})

onDeactivated(() => {
  console.log('组件被缓存')
})
</script>

<template>
  <div class="home-tab">
    <van-search shape="round" background="#F04142" placeholder="请输入搜索关键词" />

    <van-tabs
      v-model:active="active"
      :key="tabsKey"
      animated
      sticky
      swipeable
      color="#FF373C"
      title-active-color="#FF373C"
      @change="handleChange"
    >
      <van-tab v-for="item in list" :key="item.id" :name="item.id" :title="item.name">
        <div
          class="scroll-container"
          :ref="(el) => (scrollContainers[item.id] = el)"
          @scroll="handleScroll"
          style="height: calc(100vh - 100px); overflow: auto"
        >
          <NewsList :channelId="item.channel_id" :channelName="item.name"></NewsList>
        </div>
      </van-tab>

      <template #nav-bottom>
        <span @click="isChannelEditShow = true" class="iconfont icon-a-44tubiao-93 container"></span>
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

<style lang="less" scoped>
.icon-a-44tubiao-93 {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 88px;
  font-size: 36px;
  background: var(--bg-color-1);
}
</style>
