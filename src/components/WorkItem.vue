<script setup>
import { formatVideoDuration, formatPublishTime } from '@/utils/convert'

defineProps({
  work: {
    type: Object,
    required: true,
  },
})

// const isShowRight = computed(() => {

//  })
</script>
<template>
  <div class="work-item">
    <div class="left">
      <h1 class="title">{{ work.title }}</h1>
      <span v-if="work.type === 'article'" class="data">{{ work.view_count }}阅读</span>
      <span v-if="work.type === 'video'" class="data">{{ work.play_count }}播放</span>
      <span class="data">{{ work.comment_count }}评论</span>
      <span class="pub-time">{{ formatPublishTime(work.publish_time) }}</span>
    </div>
    <div v-if="work.ui_style !== 'image_none'" class="right">
      <div
        v-if="work.type === 'article'"
        class="article-img"
        :style="{ backgroundImage: `url(${work.image_list[0]})` }"
      ></div>
      <div v-if="work.type === 'video'" class="video-img">
        <i :style="{ backgroundImage: `url(${work.image_src})` }"></i>
        <img :src="work.image_src" alt="" />
        <div class="play"><span class="iconfont icon-play1"></span></div>
        <div class="duration">{{ formatVideoDuration(work.video_info.duration) }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.work-item {
  display: flex;
  margin: 20px 0;
  .left {
    flex: 1;
    margin-right: 20px;
    .title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      max-height: 80px;
      margin-bottom: 30px;
      font-size: 30px;
    }
    .data,
    .pub-time {
      font-size: 26px;
      margin-right: 20px;
      color: var(--text-color-3);
    }
  }
  .right {
    width: 240px;
    height: 160px;
    border-radius: 10px;
    overflow: hidden;
    .article-img {
      width: 240px;
      height: 160px;
      border-radius: 10px;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .video-img {
      position: relative;
      text-align: center;
      width: 240px;
      height: 160px;
      i {
        display: block;
        width: 240px;
        height: 160px;
        border-radius: 10px;
        filter: blur(10px);
        transform: scale(1.7);
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }
      img {
        position: absolute;
        top: 0;
        transform: translate(-50%);
        height: 160px;
      }
      .play {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #0000007d;
        color: #fff;
        text-align: center;
        line-height: 50px;
        .iconfont {
          font-size: 26px;
        }
      }
      .duration {
        position: absolute;
        right: 10px;
        bottom: 10px;
        display: inline;
        padding: 5px;
        background-color: #0000007f;
        border-radius: 8px;
        font-size: 26px;
        color: #fff;
      }
    }
  }
}
</style>
