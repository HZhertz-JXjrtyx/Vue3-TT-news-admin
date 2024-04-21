<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserDetailApi } from '@/api'
import ScrollContainer from '@/components/ScrollContainer.vue'
import WorkList from '@/components/WorkList.vue'

const router = useRouter()

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
})

const active = ref(0)
const userDetail = ref({})
const getUserDetail = async () => {
  const res = await getUserDetailApi(props.userId)
  console.log(res)
  userDetail.value = res.data
}
onMounted(() => {
  getUserDetail()
})

const tabData = [
  { title: '全部', type: 'all' },
  { title: '文章', type: 'article' },
  { title: '视频', type: 'video' },
]
</script>

<template>
  <div class="user-space">
    <div class="nav-icon" @click="router.back()"><span class="iconfont icon-a-44tubiao-14"></span></div>
    <div class="bg-img"><img src="@/assets/image/OIG.jpg" alt="" /></div>
    <div class="show-case">
      <div class="user-avatar"><img :src="userDetail.user_avatar" alt="" /></div>
      <div class="right-info">
        <div class="user-data">
          <div class="fans item">
            <span>{{ userDetail.fans_count }}</span>
            <span>粉丝</span>
          </div>
          <van-divider vertical />
          <div class="followers item">
            <span>{{ userDetail.followers_count }}</span>
            <span>关注</span>
          </div>
          <van-divider vertical />
          <div class="likes item">
            <span>{{ userDetail.likes_count }}</span>
            <span>获赞</span>
          </div>
        </div>
        <div class="btn">
          <van-button plain block color="#f04142">编辑资料</van-button>
        </div>
      </div>
    </div>
    <div class="user-info">
      <div class="nickname">{{ userDetail.user_nickname }}</div>
      <div v-if="userDetail.user_verified" class="verified">认证: {{ userDetail.verified_content }}</div>
      <div class="intro">{{ userDetail.user_intro }}</div>
      <div class="uid">UID: {{ userDetail.user_id }}</div>
    </div>
    <div class="work">
      <van-tabs v-model:active="active" shrink sticky>
        <van-tab :title="item.title" v-for="item in tabData" :key="item.title">
          <ScrollContainer>
            <WorkList :userId="props.userId" :worksType="item.type" />
          </ScrollContainer>
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
