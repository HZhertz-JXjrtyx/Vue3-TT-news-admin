<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import { showDialog } from 'vant'
import { useUserStore } from '@/stores'
import { getUserDetailApi, isFollowUserApi, followUserApi, isHaveChat, addChatApi } from '@/api'
import ScrollContainer from '@/components/ScrollContainer.vue'
import WorkList from '@/components/work/WorkList.vue'
import FollowBotton from '@/components/FollowBotton.vue'

const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
})

const active = ref(0)

// 获取用户信息
const userDetail = ref({})
const getUserDetail = async () => {
  const res = await getUserDetailApi(props.userId)
  console.log(res)
  userDetail.value = res.data
}
onMounted(() => {
  getUserDetail()
})

// 是否是个人空间
const isSelf = computed(() => {
  return props.userId === userStore.userInfo.user_id
})

// 是否关注用户
const isFollow = ref(false)
const getIsFollow = async () => {
  const res = await isFollowUserApi(props.userId)
  console.log(res)
  isFollow.value = res.result
}
onMounted(() => {
  getIsFollow()
})

// 关注用户
const followUser = async () => {
  const res = await followUserApi(props.userId, isFollow.value)
  console.log(res)
  if (res.status === 200) {
    isFollow.value ? userDetail.value.fans_count++ : userDetail.value.fans_count--
  }
}
const debouncedFollowUser = debounce(followUser, 500)
const handleClickFollow = async () => {
  isFollow.value = !isFollow.value
  debouncedFollowUser()
}
// 展示点赞数据
const handleClickLikes = () => {
  showDialog({
    title: userDetail.value.user_nickname,
    message: `文章视频累计获赞\n${userDetail.value.likes_count}`,
    confirmButtonText: '知道了',
    confirmButtonColor: '#000',
  }).then(() => {})
}

// 作品列表
const tabData = [
  { title: '全部', type: 'all' },
  { title: '文章', type: 'article' },
  { title: '视频', type: 'video' },
]

// 发起对话
const handleChat = async () => {
  console.log(userDetail.value._id)
  // 是否已存在对话项
  const res = await isHaveChat(userDetail.value._id)
  console.log(res)
  if (res.status === 200) {
    // 是 路由跳转
    router.push({
      name: 'conversationdetail',
      params: {
        conversationId: res.data._id,
      },
    })
  } else {
    // 否 新增对话项
    const addChatRes = await addChatApi(userDetail.value._id)
    console.log(addChatRes)
    // 路由跳转
    addChatRes.status === 200 &&
      router.push({
        name: 'conversationdetail',
        params: {
          conversationId: addChatRes.data._id,
        },
      })
  }
}
</script>

<template>
  <div class="user-space">
    <div class="nav">
      <div class="back-icon" @click="router.back()"><span class="iconfont icon-arrow_left"></span></div>
      <div class="chat-icon" v-if="!isSelf" @click="handleChat">
        <span class="iconfont icon-comment_fill"></span>
      </div>
      <div class="home-icon" @click="router.replace('/home')"><span class="iconfont icon-home"></span></div>
    </div>

    <div class="bg-img"><img src="@/assets/image/bg.jpg" alt="" /></div>
    <div class="show-case">
      <div class="user-avatar"><img :src="userDetail.user_avatar" alt="" /></div>
      <div class="right-info">
        <div class="user-data">
          <router-link :to="{ name: 'userfollows', params: { userId: props.userId } }" class="fans item">
            <span>{{ userDetail.fans_count || 0 }}</span>
            <span>粉丝</span>
          </router-link>
          <van-divider vertical />
          <router-link :to="{ name: 'userfollows', params: { userId: props.userId } }" class="followers item">
            <span>{{ userDetail.followers_count || 0 }}</span>
            <span>关注</span>
          </router-link>
          <van-divider vertical />
          <div class="likes item" @click="handleClickLikes">
            <span>{{ userDetail.likes_count || 0 }}</span>
            <span>获赞</span>
          </div>
        </div>
        <div class="btn">
          <FollowBotton
            v-if="isSelf"
            :isFollow="false"
            size="large"
            followText="编辑资料"
            @click="router.push('/user/profile')"
          />
          <FollowBotton v-else :isFollow="isFollow" size="large" v-login="handleClickFollow" />
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
  .nav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
  }
  .back-icon,
  .chat-icon,
  .home-icon {
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #00000068;
    .iconfont {
      position: absolute;
      font-size: 36px;
      color: #ffffff;
    }
  }
  .back-icon {
    top: 30px;
    left: 30px;
    .iconfont {
      top: 12px;
      left: 11px;
    }
  }
  .chat-icon {
    top: 30px;
    right: 120px;
    .iconfont {
      top: 12px;
      left: 11px;
    }
  }
  .home-icon {
    top: 30px;
    right: 30px;
    .iconfont {
      top: 10px;
      left: 12px;
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
        .follow {
          color: #616161 !important;
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
  }
}
</style>
