<template>
  <div class="news-item">
    <div class="image-none" v-if="uiStyle === 'image_none'">
      <div class="title">{{ news.title }}</div>
      <div class="description">{{ news.article_info.description }}</div>
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
        <div class="pub-time">{{ news.publish_time }}</div>
      </div>
    </div>
    <div class="image-right" v-if="uiStyle === 'image_right'">
      <div class="title">{{ news.title }}</div>
      <div class="middle">
        <div class="description">{{ news.article_info.description }}</div>
        <img class="img" :src="news.image_list[0].url" alt="" />
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
        <div class="pub-time">{{ news.publish_time }}</div>
      </div>
    </div>
    <div class="image-list" v-if="uiStyle === 'image_list'">
      <div class="title">{{ news.title }}</div>
      <div class="img-wrap">
        <div class="img-wrap-item" v-for="(img, index) in news.image_list" :key="index">
          <van-image class="img-item" fit="cover" :src="img.url" />
        </div>
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
        <div class="pub-time">{{ news.publish_time }}</div>
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
        <div class="pub-time">{{ news.publish_time }}</div>
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
              {{ '12万' }}
            </div>
            <div class="item">
              <span class="iconfont icon-a-44tubiao-112"></span>
              {{ '2222' }}
            </div>
          </div>
          <div class="duraction">{{ '41:36' }}</div>
        </div>
      </div>
      <div class="title">{{ news.title }}</div>
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
        <div class="pub-time">{{ news.publish_time }}</div>
      </div>
    </div>
    <van-divider :style="{ color: '#ccc', borderColor: '#ccc' }"> </van-divider>
  </div>
</template>

<script setup>
const props = defineProps({
  news: {
    type: Object,
    required: true
  }
})
const uiStyle = props.news.ui_style
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
  height: 80px;
  margin: 10px 0;
  font-size: 14px;
  line-height: 20px;
  line-break: anywhere;
  text-indent: 28px;
  color: #555555;
  overflow: hidden;
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #bbbbbb;
  .user {
    display: flex;
    align-items: center;
    .user-avatar {
      border: 1px solid #aaa;
    }
    .user-name {
      margin-left: 6px;
      font-size: 14px;
    }
  }
}

.image-right {
  .middle {
    display: flex;

    .img {
      height: 80px;
      margin-top: 10px;
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
      .img-item {
        width: 78px;
        height: 78px;
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
        border-radius: 4px;
      }
      .iconfont {
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
}

// .divider {
//   color: #555555;
// }
</style>
