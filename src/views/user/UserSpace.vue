<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ScrollContainer from '@/components/ScrollContainer.vue'

const router = useRouter()

defineProps({
  userId: {
    type: Number,
    required: true,
  },
})

const active = ref(0)
</script>

<template>
  <div class="user-space">
    <div class="nav-icon" @click="router.back()"><span class="iconfont icon-a-44tubiao-14"></span></div>
    <div class="bg-img"><img src="@/assets/image/OIG.jpg" alt="" /></div>
    <div class="show-case">
      <div class="user-avatar"><img src="@/assets/image/OIG.jpg" alt="" /></div>
      <div class="right-info">
        <div class="user-data">
          <div class="fans item">
            <span>222</span>
            <span>粉丝</span>
          </div>
          <van-divider vertical />
          <div class="followers item">
            <span>222</span>
            <span>关注</span>
          </div>
          <van-divider vertical />
          <div class="likes item">
            <span>222</span>
            <span>获赞</span>
          </div>
        </div>
        <div class="btn">
          <van-button plain block color="#f04142">编辑资料</van-button>
        </div>
      </div>
    </div>
    <div class="user-info">
      <div class="nickname">HZhertz</div>
      <div v-if="true" class="verified">认证：保定电视台新媒体官方账号</div>
      <div class="intro">fly me to the moon</div>
      <div class="uid">UID:101111111</div>
    </div>
    <div class="work">
      <van-tabs v-model:active="active" shrink sticky>
        <van-tab title="全部">
          <ScrollContainer>
            <WorkList></WorkList>
          </ScrollContainer>
        </van-tab>
        <van-tab title="文章">
          <div class="scroll-container">
            <WorkList></WorkList>
          </div>
        </van-tab>
        <van-tab title="视频">
          <div class="scroll-container">
            <WorkList></WorkList>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user-space {
  .nav-icon {
    position: absolute;
    top: 40px;
    left: 40px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #00000068;
    .iconfont {
      position: absolute;
      top: 12px;
      left: 11px;
      font-size: 36px;
      color: #ffffff;
    }
  }
  .bg-img {
    img {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }
  }
  .show-case {
    display: flex;
    .user-avatar {
      flex: 1;
      position: relative;
      img {
        position: absolute;
        top: -40px;
        left: 50px;
        width: 180px;
        height: 180px;
        border: 1px solid #ffffff;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    .right-info {
      width: 420px;
      margin-right: 30px;

      .user-data {
        display: flex;

        align-items: center;
        .item {
          display: flex;
          flex-direction: column;
          padding: 20px 40px;
        }
      }
      .btn {
        .van-button {
          height: 60px;
        }
      }
    }
  }
  .user-info {
    margin: 20px 30px;
    & > * {
      padding-bottom: 20px;
    }

    .nickname {
      font-size: 40px;
      color: var(--main-color-red-2);
    }
    .verified {
      font-size: 26px;
      color: var(--text-color-2);
    }
    .intro,
    .uid {
      font-size: 26px;
      color: var(--text-color-3);
    }
  }
  .work {
    border-top: 1px solid #dcdcdc;
    .scroll-container {
      height: calc(100vh - 80px);
      overflow: auto;
    }
  }
}
</style>
