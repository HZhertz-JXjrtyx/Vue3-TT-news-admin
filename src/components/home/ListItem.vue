<script setup>
import { ref } from 'vue'
import { formatCount, formatVideoDuration, convertToMMDDHHmm } from '@/utils/convert'

const props = defineProps({
  news: {
    type: Object,
    required: true,
  },
})
const uiStyle = props.news.ui_style
const imgList = props.news.image_list ? props.news.image_list.slice(0, 4) : []
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
      <div class="play" :style="{ backgroundImage: `url(${news.image_src})` }">
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
      <router-link
        class="user"
        :to="{ name: 'userspace', params: { userId: news.user_info.user_id } }"
        @click.stop
      >
        <van-image class="user-avatar" round width="30px" height="30px" :src="news.user_info.user_avatar" />
        <span class="user-name">{{ news.user_info.user_nickname }}</span>
      </router-link>
      <div class="pub-time">{{ pubtime }}</div>
    </div>
    <van-divider :style="{ color: '#ccc', borderColor: '#ccc' }"> </van-divider>
  </div>
</template>

<style lang="less" scoped>
.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  max-height: 80px;
  font-size: 34px;
  font-weight: 600;
  line-height: 40px;
  line-break: anywhere;
  color: var(--title-color);
}
.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  max-height: 200px;
  margin: 20px 0;
  font-size: 28px;
  line-height: 50px;
  line-break: anywhere;
  text-indent: 56px;
  color: var(--text-color-2);
  overflow: hidden;
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26px;
  color: var(--text-color-3);
  .user {
    display: flex;
    align-items: center;
    .user-avatar {
      border: 1px solid var(--text-color-3);
    }
    .user-name {
      margin-left: 12px;
    }
  }
  .pub-time {
    margin-right: 20px;
  }
}

.image-right {
  .middle {
    display: flex;

    .img {
      height: 200px;
      margin: 20px 0 20px 20px;
      border-radius: 8px;
    }
  }
}
.image-list {
  .img-wrap {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    .img-wrap-item {
      position: relative;
      width: 160px;
      height: 160px;
      .img-item {
        width: 160px;
        height: 160px;
        object-fit: cover;
        border-radius: 4px;
      }
      .overlay {
        position: absolute;
        top: 0;
        width: 160px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        font-size: 40px;
        text-align: center;
        line-height: 160px;
        border-radius: 4px;
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
        height: 200px;
        margin: 20px 0 20px 20px;
        border-radius: 8px;
      }
      .icon-play1 {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 40px;
        color: var(--bg-color-3);
      }
    }
  }
}
.image-large-video {
  .play {
    position: relative;
    margin: 30px auto;
    border-radius: 12px;
    height: 400px;
    background-position: center;
    background-size: auto 100%;
    background-color: black;
    background-repeat: no-repeat;

    .icon-play1 {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 80px;
      color: var(--bg-color-3);
    }
    .info {
      position: absolute;
      bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 680px;
      height: 40px;
      padding: 0 20px;
      font-size: 28px;
      color: var(--bg-color-1);
      .left {
        display: flex;
        align-items: center;
        .item {
          display: flex;
          align-items: center;
          margin-right: 32px;
        }
      }
    }
  }
  .title {
    margin: 20px 0;
  }
}
</style>
