<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import LoadIcon from './LoadIcon.vue'

const userStore = useUserStore()

const showBottom = ref(false)
</script>
<template>
  <div class="tabbar">
    <van-tabbar route active-color="#f04142">
      <van-tabbar-item replace to="/home">
        <template #icon="{ active }">
          <LoadIcon iconSrc="http://127.0.0.1:3007/other/lord_icon/home.json" :active="active" />
        </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item replace to="/hot">
        <template #icon="{ active }">
          <LoadIcon
            iconSrc="http://127.0.0.1:3007/other/lord_icon/explore-compass.json"
            :active="active"
          ></LoadIcon>
        </template>
        热点
      </van-tabbar-item>
      <van-tabbar-item>
        <div class="publish" @click="showBottom = true">
          <span class="iconfont icon-cc-plus-crude"></span>
        </div>
      </van-tabbar-item>
      <van-tabbar-item replace to="/message">
        <template #icon="{ active }">
          <LoadIcon iconSrc="http://127.0.0.1:3007/other/lord_icon/chat.json" :active="active"></LoadIcon>
        </template>
        消息
      </van-tabbar-item>
      <van-tabbar-item replace to="/user">
        <template #icon="{ active }">
          <LoadIcon iconSrc="http://127.0.0.1:3007/other/lord_icon/account.json" :active="active"></LoadIcon>
        </template>
        {{ userStore.token ? '我的' : '未登录' }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
  <van-popup v-model:show="showBottom" position="bottom" round :style="{ height: '40%' }">
    <van-cell-group inset>
      <van-cell title="发布文章" size="large"> <img src="@/assets/image/edit.png" alt="" /></van-cell>
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="发布视频" size="large"> <img src="@/assets/image/camera.png" alt="" /></van-cell>
    </van-cell-group>
  </van-popup>
</template>

<style lang="less" scoped>
:deep(.van-tabbar-item__icon) {
  margin: 0;
  padding: 0;
}
.publish {
  position: relative;
  z-index: 2024;
  bottom: 20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  text-align: center;
  line-height: 100px;
  background-color: var(--main-color-red-2);
  .icon-cc-plus-crude {
    color: var(--bg-color-1);
    font-size: 50px;
  }
}
.van-popup {
  background-color: var(--bg-color-3);
  .van-cell-group {
    margin: 60px 40px;
    :deep(.van-cell__title) {
      text-align: center;
      line-height: 120px;
      span {
        font-size: 40px;
        font-weight: 400;
      }
    }
    img {
      width: 120px;
    }
  }
}
</style>
