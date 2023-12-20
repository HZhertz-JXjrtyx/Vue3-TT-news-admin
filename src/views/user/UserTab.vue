<template>
  <div v-if="user.token" class="login"></div>
  <div v-else class="not-login">
    <div class="top login-btn">
      <div class="img">
        <span class="iconfont icon-a-44tubiao-57"></span>
      </div>

      <div class="text" @click="$router.push('/user/login')">点击登录</div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores'

const user = useUserStore()
</script>
<style lang="less" scoped>
.top {
  height: 230px;
  background-color: rgb(197, 66, 34);
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
</style>
