<template>
  <div class="tab-title">消息私信</div>
  <div class="inform">
    <van-cell is-link>
      <template #icon>
        <div class="inform-icon" :style="{ backgroundColor: '#00b2fd' }">
          <img src="@/assets/image/comment_icon.png" alt="" />
        </div>
      </template>
      <template #title>
        <div class="inform-content">
          <span class="content__type-text">评论</span>
          <span class="content__latest-word">xxx评论了你的评论</span>
        </div>
      </template>
      <template #value>
        <div class="inform-badge">
          <van-badge :content="100" max="99" />
        </div>
      </template>
    </van-cell>
    <van-cell is-link>
      <template #icon>
        <div class="inform-icon" :style="{ backgroundColor: '#ff676c' }">
          <img src="@/assets/image/like_icon.png" alt="" />
        </div>
      </template>
      <template #title>
        <div class="inform-content">
          <span class="content__type-text">点赞</span>
          <span class="content__latest-word">xxx点赞了你的xx</span>
        </div>
      </template>
      <template #value>
        <div class="inform-badge">
          <van-badge :content="100" max="99" />
        </div>
      </template>
    </van-cell>
    <van-cell is-link>
      <template #icon>
        <div class="inform-icon" :style="{ backgroundColor: '#ff7f21' }">
          <img src="@/assets/image/fans_icon.png" alt="" />
        </div>
      </template>
      <template #title>
        <div class="inform-content">
          <span class="content__type-text">粉丝</span>
          <span class="content__latest-word">xxx关注了你</span>
        </div>
      </template>
      <template #value>
        <div class="inform-badge">
          <van-badge :content="100" max="99" />
        </div>
      </template>
    </van-cell>
  </div>
  <div class="conversation-list">
    <van-swipe-cell right-width="40">
      <div class="conversation">
        <div class="conversation-left">
          <div class="left__user-avatar">
            <van-image
              round
              fit="cover"
              position="center"
              src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
            />
          </div>
        </div>
        <div class="conversation-center">
          <span class="center__user-nickname">用户</span>
          <span class="center__latest-word">eeadaffgagagagagagagafafafgageee</span>
        </div>
        <div class="conversation-right">
          <span class="right__latest-time">04-25</span>
          <span class="right__badge"><van-badge :content="100" max="99" /></span>
        </div>
      </div>
      <template #right>
        <van-button square type="danger" text="删除" />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script setup></script>
<style lang="less" scoped>
.tab-title {
  padding: 30px 30px;
  font-size: 34px;
  text-align: center;
  border-bottom: 1px solid #eeeeee;
}
.inform {
  border-bottom: 8px solid #f0f0f0;
  .inform-icon {
    background-color: blue;
    width: 100px;
    height: 100px;
    margin-right: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 60%;
    }
  }
  .inform-badge {
    position: relative;
    .van-badge {
      position: absolute;
      top: 70px;
      right: 28px;
    }
  }
  :deep(.van-cell__right-icon) {
    line-height: 100px;
  }
}

.conversation {
  display: flex;
  padding: 20px 30px;
  border-bottom: 1px solid #efefef;
  .conversation-left {
    .left__user-avatar {
      width: 100px;
      height: 100px;
      margin-right: 30px;
      .van-image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .conversation-center {
    flex: 1;
  }
  .conversation-right {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100px;
    text-align: right;
    .right__latest-time {
      font-size: 24px;
      color: #a8a8a8;
    }
    .right__badge {
      position: relative;
      height: 40px;
      .van-badge {
        position: absolute;
        top: 20px;
        right: 28px;
      }
    }
  }
}

.van-swipe-cell__right {
  width: 100px;
  text-align: center;
  .van-button {
    height: 100%;
    width: 100px;
    padding: 0 30px 0 12px;
  }
}

.inform-content,
.conversation-center {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.content__type-text,
.center__user-nickname {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 460px;
  font-size: 30px;
  font-weight: bolder;
}
.content__latest-word,
.center__latest-word {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 460px;
  font-size: 26px;
  color: #686868;
}
</style>
