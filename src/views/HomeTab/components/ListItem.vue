<script setup>
import { ref } from 'vue'
import { formatCount, formatVideoDuration, convertToMMDDHHmm, formatPublishTime } from '@/utils'

const props = defineProps({
  news: {
    type: Object,
    required: true,
  },
})
console.log(props.news)
const uiStyle = props.news.ui_style
const imgList = props.news.cover_image ? props.news.cover_image.slice(0, 3) : []
const playCount = ref('')
const commentCount = ref('')
const duraction = ref('')
const pubtime = ref('')

pubtime.value = convertToMMDDHHmm(props.news.publish_time)
if (props.news.type === 'video') {
  playCount.value = formatCount(props.news.play_count)
  commentCount.value = formatCount(props.news.comment_count)
  duraction.value = formatVideoDuration(props.news.video_info.duration)
}
</script>

<template>
  <div class="news-item">
    <div class="article-item" v-if="props.news.type === 'article'">
      <div class="item__content">
        <div class="content__title news-title">{{ props.news.title }}</div>
        <div class="content__cover--list" v-if="uiStyle === 'image_list'">
          <van-image
            v-for="(item, index) in imgList"
            :key="index"
            fit="cover"
            position="center"
            :src="item"
          />
        </div>
        <div class="content__publish-info news-publish-info">
          <span class="publish-info__user-nickname">{{ props.news.user_info.user_nickname }}</span>
          <span class="publish-info__comment-count">{{ props.news.comment_count }}评论</span>
          <span class="publish-info__publish-time">{{ formatPublishTime(props.news.publish_time) }}</span>
        </div>
      </div>
      <div class="item__cover--right" v-if="uiStyle === 'image_right'">
        <van-image fit="cover" position="center" :src="imgList[0]" />
      </div>
    </div>
    <div class="video-item" v-if="props.news.type === 'video'">
      <div class="item__title news-title">{{ props.news.title }}</div>
      <div class="item__content">
        <div class="content__cover">
          <van-image fit="contain" position="center" :src="props.news.image_src" />
        </div>
        <i class="content__playicon">
          <span class="iconfont icon-play1"></span>
        </i>
        <span class="content__duration">{{ formatVideoDuration(props.news.video_info.duration) }}</span>
      </div>
      <div class="item__publish-info news-publish-info">
        <span class="publish-info__user-nickname">{{ props.news.user_info.user_nickname }}</span>
        <span class="publish-info__comment-count">{{ props.news.comment_count }}评论</span>
        <span class="publish-info__publish-time">{{ formatPublishTime(props.news.publish_time) }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.article-item {
  display: flex;
  position: relative;
  border-bottom: 1px solid var(--bg-color-3);
  .item__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .content__cover--list {
      display: flex;
      justify-content: space-between;
      padding: 20px 30px 0 30px;
    }
  }
  .item__cover--right {
    .van-image {
      margin: 30px 30px 30px 0;
    }
  }
  :deep(.van-image) {
    width: 220px;
    height: 180px;
    img {
      border-radius: 10px;
    }
  }
}
.video-item {
  .item__content {
    position: relative;
    margin: 10px 30px;
    :deep(.van-image) {
      width: 100%;
      height: 388px;
      border-radius: 10px;
      overflow: hidden;
    }
    .content__playicon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .iconfont {
        font-size: 60px;
        color: rgb(255, 255, 255);
      }
    }
    .content__duration {
      position: absolute;
      right: 30px;
      bottom: 20px;
      color: rgb(255, 255, 255);
    }
  }
}
.news-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  max-height: 130px;
  margin: 30px 20px 0 30px;
  font-size: 32px;
  word-break: break-all;
  color: var(--title-color);
}

.news-publish-info {
  margin: 10px 0 30px 30px;
  span {
    padding-right: 10px;
    font-size: 24px;
    color: var(--text-color-3);
  }
}
</style>
