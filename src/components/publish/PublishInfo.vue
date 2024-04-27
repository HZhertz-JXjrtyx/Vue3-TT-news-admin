<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'

const props = defineProps({
  publishType: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const userStore = useUserStore()

const selectCover = ref(props.publishType === 'article' ? '无图' : '单图')
const selectCoverType = (e) => {
  console.dir(e.target)
  selectCover.value = e.target.innerText
}
</script>
<template>
  <div class="publish-info">
    <div class="info">
      <div class="left">
        <div class="title">{{ props.title }}</div>
        <div v-if="selectCover === '三图'" class="uploader-list">
          <div class="uploader"></div>
          <div class="uploader"></div>
          <div class="uploader"></div>
        </div>
        <div class="user-info">用户{{ userStore.userInfo.user_id }}</div>
      </div>
      <div v-if="selectCover === '单图'" class="right">
        <div class="uploader"></div>
      </div>
    </div>
    <div class="cover-setting">
      封面设置
      <div class="cover-type" @click="selectCoverType">
        <span :class="{ selected: selectCover === '无图' }">无图</span>
        <span :class="{ selected: selectCover === '单图' }">单图</span>
        <span :class="{ selected: selectCover === '三图' }">三图</span>
      </div>
      <div class="upload-cover"></div>
    </div>
    <div class="bottom">发布</div>
  </div>
</template>

<style lang="less" scoped>
.publish-info {
  margin: 100px 0;
  .info {
    display: flex;
    position: relative;
    border-top: 1px solid var(--bg-color-3);
    border-bottom: 1px solid var(--bg-color-3);
    .left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .title {
        margin: 40px 40px 0;
        font-size: 34px;
        font-weight: 600;
      }
      .uploader-list {
        display: flex;
        justify-content: space-between;
        padding: 20px 40px 0 40px;
        .uploader {
          width: 220px;
          height: 180px;
          border-radius: 10px;
          background-color: #01a6ff;
        }
      }
      .user-info {
        margin: 10px 0 40px 40px;
        font-size: 24px;
        color: var(--text-color-3);
      }
    }
    .right {
      .uploader {
        width: 220px;
        height: 180px;
        margin: 40px 30px 40px 0;
        border-radius: 10px;
        background-color: #01a6ff;
      }
    }
  }
  .cover-setting {
    .cover-type {
      float: right;
      span {
        display: inline-block;
        width: 100px;
        height: 50px;
        margin: 0 10px;
        border-radius: 25px;
        background-color: var(--bg-color-3);
        text-align: center;
        line-height: 50px;
        font-size: 25px;
      }
      .selected {
        color: var(--main-color-red-1);
        background-color: #ff373a32;
      }
    }
    margin: 20px 40px;
  }
}
</style>
