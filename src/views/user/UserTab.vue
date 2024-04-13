<script setup>
import { watchEffect } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
watchEffect(() => {
  if (userStore.token) {
    userStore.fetchUserInfo()
  }
})
</script>

<template>
  <div class="user-tab-container">
    <div v-if="userStore.token" class="login">
      <div class="top">
        <div class="base-info">
          <img :src="userStore.userInfo.user_avatar" alt="" class="avatar" />
          <span class="nickname">
            {{ userStore.userInfo.user_nickname }}
            <span class="iconfont icon-a-44tubiao-17" @click="$router.push('/user/profile')"></span>
          </span>
          <span class="user-id">UID:{{ userStore.userInfo.user_id }}</span>
          <div class="space-btn" @click="$router.push('/user/space')">
            空间<van-icon name="arrow" />
          </div>
        </div>
        <div class="data-status">
          <div class="data-item" @click="$router.push('/user')">
            <span class="count">{{ 0 }}</span>
            <span class="text">动态</span>
          </div>
          <div
            class="data-item"
            @click="$router.push({ name: 'userlist', params: { type: 'follow' } })"
          >
            <span class="count">{{ 6 }}</span>
            <span class="text">关注</span>
          </div>
          <div
            class="data-item"
            @click="$router.push({ name: 'userlist', params: { type: 'fans' } })"
          >
            <span class="count">{{ 0 }}</span>
            <span class="text">粉丝</span>
          </div>
          <div class="data-item" @click="$router.push('/user')">
            <span class="count">{{ 6 }}</span>
            <span class="text">评论</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="not-login">
      <div class="top login-btn">
        <div class="img">
          <span class="iconfont icon-a-44tubiao-57"></span>
        </div>

        <div class="text" @click="$router.push('/user/login')">点击登录</div>
      </div>
    </div>
    <van-grid clickable :column-num="2" class="grid-nav">
      <van-grid-item class="grid-item" to="/user/favorites">
        <span class="iconfont icon-a-44tubiao-134"></span>
        <span class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item" to="/user/browsinghistory">
        <span class="iconfont icon-a-44tubiao-74"></span>
        <span class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <van-cell title="账户安全" is-link to="/security">
      <template #icon>
        <span class="iconfont icon-a-44tubiao-114"></span>
      </template>
    </van-cell>
    <van-cell title="设置" is-link to="/user">
      <template #icon>
        <span class="iconfont icon-a-44tubiao-47"></span>
      </template>
    </van-cell>
    <van-cell title="客服" is-link to="/user">
      <template #icon>
        <span class="iconfont icon-a-44tubiao-131"></span>
      </template>
    </van-cell>
    <van-cell title="问题" is-link to="/user">
      <template #icon>
        <span class="iconfont icon-a-44tubiao-07"></span>
      </template>
    </van-cell>
  </div>
</template>

<style lang="less" scoped>
.top {
  height: 230px;
  background: url('@/assets/image/OIG.jpg');
  background-size: cover;
}

.not-login {
  .login-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 70px;
      height: 70px;
      background-color: #fff;
      border-radius: 50%;
      .icon-a-44tubiao-57 {
        font-size: 35px;
        color: rgb(197, 66, 34);
      }
    }
    .text {
      color: #fff;
      font-size: 18px;
      margin-top: 10px;
    }
  }
}
.login {
  .base-info {
    position: relative;
    height: 160px;
    .avatar {
      position: absolute;
      top: 50px;
      left: 30px;
      border-radius: 50%;
      width: 70px;
      height: 70px;
    }
    .nickname {
      position: absolute;
      top: 65px;
      left: 110px;
      font-size: 20px;
      color: #000000;
    }
    .user-id {
      position: absolute;
      top: 100px;
      left: 110px;
      font-size: 12px;
      font-weight: 700;
      color: #505050;
    }
    .iconfont {
      font-size: 20px;
      color: #000000;
    }
    .space-btn {
      position: absolute;
      top: 80px;
      left: 300px;
      font-size: 14px;
      font-weight: 700;
      color: #505050;
    }
  }
  .data-status {
    display: flex;

    .data-item {
      height: 60px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #000000;

      .count {
        font-size: 20px;
      }

      .text {
        font-size: 16px;
      }
    }
  }
}
.grid-nav {
  margin-bottom: 15px;

  .grid-item {
    height: 70px;

    .iconfont {
      font-size: 28px;
      color: rgb(197, 66, 34);
    }

    .text {
      font-size: 16px;
    }
  }
}
.van-cell {
  .iconfont {
    font-size: 20px;
    margin-right: 10px;
  }
  font-size: 16px;
}
</style>
