<template>
  <div class="title">消息私信</div>
  <div class="notification">
    <van-cell title="评论" is-link />
    <van-cell title="点赞" is-link />
    <van-cell title="粉丝" is-link />
  </div>
  <div class="message-list">
    <van-swipe-cell>
      <div class="conversation">
        <div class="conversation__left">
          <div class="user-avatar">
            <van-image
              round
              fit="cover"
              position="center"
              src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
            />
          </div>
        </div>
        <div class="conversation__center">
          <div class="user-nickname">用户</div>
          <div class="latest-word">eeadaffgagagagagagagafafafgageee</div>
        </div>
        <div class="conversation__right">
          <div class="latest-time">04-25</div>
          <div class="badge"><van-badge :content="1" max="99" /></div>
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
.notification {
  border-bottom: 8px solid #f0f0f0;
}
.title {
  padding: 30px 30px;
  font-size: 34px;
  text-align: center;
  border-bottom: 1px solid #eeeeee;
}
.conversation {
  display: flex;
  padding: 20px 30px;
  .conversation__left {
    .user-avatar {
      width: 120px;
      height: 120px;
      margin-right: 30px;
      .van-image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .conversation__center {
    flex: 1;
    .user-nickname {
      margin-top: 16px;
      font-size: 32px;
      font-weight: bolder;
    }
    .latest-word {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 420px;
      margin-top: 10px;
      color: #686868;
    }
  }
  .conversation__right {
    width: 100px;
    text-align: right;
    .latest-time {
      margin-top: 16px;
      color: #a8a8a8;
    }
    .badge {
      position: relative;
      margin-top: 10px;
      .van-badge {
        position: absolute;
        top: 20px;
        right: 20px;
      }
    }
  }
}
.van-swipe-cell__right {
  .van-button {
    height: 100%;
  }
}
</style>
