<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const router = useRouter()

const userStore = useUserStore()
onMounted(async () => {
  if (userStore.token) {
    await userStore.fetchUserInfo()
  }
})
</script>

<template>
  <div class="user-tab">
    <div v-if="userStore.token" class="login">
      <div class="top">
        <div class="base-info">
          <img :src="userStore.userInfo.user_avatar" alt="" class="avatar" />
          <span class="nickname">
            {{ userStore.userInfo.user_nickname }}
            <span class="iconfont icon-modify" @click="router.push('/user/profile')"></span>
          </span>
          <span class="user-id">UID:{{ userStore.userInfo.user_id }}</span>
          <div
            class="space-btn"
            @click="router.push({ name: 'userspace', params: { userId: userStore.userInfo?.user_id } })"
          >
            空间<van-icon name="arrow" />
          </div>
        </div>
        <div class="data-status">
          <router-link
            class="data-item"
            :to="{ name: 'userspace', params: { userId: userStore.userInfo?.user_id } }"
          >
            <span class="count">{{ userStore.userInfo.works_count }}</span>
            <span class="text">作品</span>
          </router-link>
          <router-link
            class="data-item"
            :to="{ name: 'userfollows', params: { userId: userStore.userInfo.user_id } }"
            @click="userStore.userFollowActiveTab = 1"
          >
            <span class="count">{{ userStore.userInfo.fans_count }}</span>
            <span class="text">粉丝</span>
          </router-link>
          <router-link
            class="data-item"
            :to="{
              name: 'userfollows',
              params: { userId: userStore.userInfo.user_id },
            }"
            @click="userStore.userFollowActiveTab = 0"
          >
            <span class="count">{{ userStore.userInfo.followers_count }}</span>
            <span class="text">关注</span>
          </router-link>
          <div class="data-item" @click="router.push('/user')">
            <span class="count">{{ userStore.userInfo.comment_count }}</span>
            <span class="text">评论</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="not-login">
      <div class="top login-btn">
        <div class="img">
          <span class="iconfont icon-mobile"></span>
        </div>

        <div class="text" @click="router.push('/user/login')">点击登录</div>
      </div>
    </div>
    <van-grid clickable :column-num="2" class="grid-nav">
      <van-grid-item class="grid-item" to="/user/favorite">
        <span class="iconfont icon-favorite"></span>
        <span class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item" to="/user/browse">
        <span class="iconfont icon-eyes"></span>
        <span class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <van-cell title="账户安全" is-link to="/security">
      <template #icon>
        <span class="iconfont icon-security"></span>
      </template>
    </van-cell>
    <van-cell title="设置" is-link to="/user">
      <template #icon>
        <span class="iconfont icon-setting"></span>
      </template>
    </van-cell>
    <van-cell title="客服" is-link to="/user">
      <template #icon>
        <span class="iconfont icon-service"></span>
      </template>
    </van-cell>
    <van-cell title="问题" is-link to="/user">
      <template #icon>
        <span class="iconfont icon-question"></span>
      </template>
    </van-cell>
  </div>
</template>

<style lang="less" scoped>
.top {
  height: 460px;
  background: url('@/assets/image/bg.jpg');
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

      width: 140px;
      height: 140px;
      background-color: #fff;
      border-radius: 50%;
      .icon-mobile {
        font-size: 70px;
        color: #f04142;
      }
    }
    .text {
      color: #fff;
      font-size: 36px;
      margin-top: 20px;
    }
  }
}
.login {
  .base-info {
    position: relative;
    height: 320px;
    .avatar {
      position: absolute;
      top: 100px;
      left: 60px;
      border-radius: 50%;
      width: 140px;
      height: 140px;
      object-fit: cover;
    }
    .nickname {
      position: absolute;
      top: 130px;
      left: 220px;
      font-size: 40px;
      color: #000000;
    }
    .user-id {
      position: absolute;
      top: 200px;
      left: 220px;
      font-size: 24px;
      font-weight: 700;
      color: #505050;
    }
    .iconfont {
      font-size: 40px;
      color: #000000;
    }
    .space-btn {
      position: absolute;
      top: 160px;
      left: 600px;
      font-size: 28px;
      font-weight: 700;
      color: #505050;
    }
  }
  .data-status {
    display: flex;

    .data-item {
      height: 160px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #000000;

      .count {
        font-size: 40px;
      }

      .text {
        font-size: 32px;
      }
    }
  }
}
.grid-nav {
  margin-bottom: 30px;

  .grid-item {
    height: 140px;

    .iconfont {
      font-size: 56px;
      color: #f04142;
    }

    .text {
      font-size: 32px;
    }
  }
}
.van-cell {
  .iconfont {
    font-size: 40px;
    margin-right: 20px;
  }
  font-size: 32px;
}
</style>
