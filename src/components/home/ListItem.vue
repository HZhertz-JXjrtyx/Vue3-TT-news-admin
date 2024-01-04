<template>
  <div class="news-item">
    <div class="image-none" v-if="uiStyle === 'image_none'">
      <div class="title">{{ news.title }}</div>
      <div class="description">{{ news.article_info.description }}</div>
    </div>
    <div class="image-right" v-if="uiStyle === 'image_right'">
      <div class="title">{{ news.title }}</div>
      <div class="middle">
        <div class="description">{{ news.article_info.description }}</div>
        <img class="img" :src="news.image_list[0]" alt="" />
      </div>
    </div>
    <div class="image-list" v-if="uiStyle === 'image_list'">
      <div class="title">{{ news.title }}</div>
      <div class="img-wrap">
        <div v-for="(img, index) in imgList" :key="index" class="img-wrap-item">
          <img class="img-item" :src="img" alt="" />
          <div v-if="news.image_list.length > 4 && index === 3" class="overlay">
            <div class="overlay-text">+{{ news.image_list.length }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="image-right-video" v-if="uiStyle === 'image_right|video'">
      <div class="title">{{ news.title }}</div>
      <div class="middle">
        <div class="description">{{ news.video_info.description }}</div>
        <div class="play">
          <img class="img" :src="news.image_src" alt="" />
          <span class="iconfont icon-play1"></span>
        </div>
      </div>
    </div>
    <div class="image-large-video" v-if="uiStyle === 'image_large|video'">
      <div class="play">
        <img class="img" :src="news.image_src" alt="" />
        <span class="iconfont icon-play1"></span>
        <div class="info">
          <div class="left">
            <div class="item">
              <span class="iconfont icon-shipinbofangliang"></span>
              {{ playCount }}
            </div>
            <div class="item">
              <span class="iconfont icon-a-44tubiao-112"></span>
              {{ commentCount }}
            </div>
          </div>
          <div class="duraction">{{ duraction }}</div>
        </div>
      </div>
      <div class="title">{{ news.title }}</div>
    </div>
    <div class="bottom">
      <div class="user">
        <van-image
          class="user-avatar"
          round
          width="30px"
          height="30px"
          :src="news.user_info.user_avatar"
        />
        <span class="user-name">{{ news.user_info.user_nickname }}</span>
      </div>
      <div class="pub-time">{{ pubtime }}</div>
    </div>
    <van-divider :style="{ color: '#ccc', borderColor: '#ccc' }"> </van-divider>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatCount, convertToMMSS, convertToMMDDHHmm } from '@/utils/convert'

const props = defineProps({
  news: {
    type: Object,
    required: true
  }
})
const uiStyle = props.news.ui_style
const imgList = props.news.image_list ? props.news.image_list.slice(0, 4) : []
let playCount = ref('')
let commentCount = ref('')
let duraction = ref('')
let pubtime = ref('')

pubtime.value = convertToMMDDHHmm(props.news.publish_time)
if (props.news.type === 'video') {
  playCount.value = formatCount(props.news.play_count)
  commentCount.value = formatCount(props.news.comment_count)
  duraction.value = convertToMMSS(props.news.video_info.duration)
}
</script>
<style lang="less" scoped>
.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  height: 40px;
  font-size: 17px;
  font-weight: 600;
  line-height: 20px;
  line-break: anywhere;
  color: #140505;
  overflow: hidden;
}
.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  height: 100px;
  margin: 10px 0;
  font-size: 14px;
  line-height: 25px;
  line-break: anywhere;
  text-indent: 28px;
  color: #555555;
  overflow: hidden;
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #aaa;
  .user {
    display: flex;
    align-items: center;
    .user-avatar {
      border: 1px solid #aaa;
    }
    .user-name {
      margin-left: 6px;
    }
  }
  .pub-time {
    margin-right: 10px;
  }
}

.image-right {
  .middle {
    display: flex;

    .img {
      height: 100px;
      margin: 10px 0 10px 10px;
      border-radius: 4px;
    }
  }
}
.image-list {
  .img-wrap {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    .img-wrap-item {
      position: relative;
      width: 80px;
      height: 80px;
      .img-item {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 2px;
      }
      .overlay {
        position: absolute;
        top: 0;
        width: 80px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        font-size: 20px;
        text-align: center;
        line-height: 80px;
        border-radius: 2px;
      }
    }
  }
}
.image-right-video {
  .middle {
    display: flex;

    .play {
      position: relative;
      .img {
        height: 100px;
        margin: 10px 0 10px 10px;
        border-radius: 4px;
      }
      .icon-play1 {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}
.image-large-video {
  .play {
    position: relative;
    width: 340px;
    margin-bottom: 5px;
    .img {
      width: 100%;
      border-radius: 6px;
    }
    .icon-play1 {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 40px;
      color: rgba(255, 255, 255, 0.6);
    }
    .info {
      position: absolute;
      bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 340px;
      height: 20px;
      padding: 0 10px;
      font-size: 14px;
      color: #ffffff;
      .left {
        display: flex;
        align-items: center;
        .item {
          display: flex;
          align-items: center;
          margin-right: 16px;
        }
      }
    }
  }
  .title {
    margin-bottom: 10px;
  }
}
</style>
