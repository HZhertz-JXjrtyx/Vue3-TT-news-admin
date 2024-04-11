<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import { showToast } from 'vant'
import '@/styles/github-markdown-light.css'
import { useUserStore } from '@/stores'
import { getArticle, followUserApi, addCommentApi } from '@/api'
import { convertToMMDDHHmm } from '@/utils/convert'
import FollowBotton from '@/components/FollowBotton.vue'
import CommentList from '@/components/article/CommentList.vue'

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
})
const router = useRouter()
const userStore = useUserStore()
const isLogin = computed(() => {
  return !!userStore.token
})

// 获取文章详情
const articleInfo = ref({})
const pubtime = ref('')
const isFollow = ref(false)
const commentCount = ref(0)
const getArticleInfo = async () => {
  const res = await getArticle({ article_id: props.articleId })
  console.log(res)
  articleInfo.value = res.data
  pubtime.value = convertToMMDDHHmm(articleInfo.value.publish_time)
  isFollow.value = res.data.is_followed
  commentCount.value = res.data.comment_count
}

onMounted(() => {
  getArticleInfo()
})
// 关注
const followUser = async () => {
  const res = await followUserApi(articleInfo.value.user_info.user_id, isFollow.value)
  console.log(res)
  showToast(res.message)
}
const debouncedFollowUser = debounce(followUser, 500)
const handleFollowClick = () => {
  if (isLogin.value) {
    isFollow.value = !isFollow.value
    debouncedFollowUser()
  } else {
    showToast('请登录后进行操作')
  }
}

// 评论
const commentContent = ref('')
const isShowTextarea = ref(false)
const commentList = ref(null)
const isSubmitDisabled = computed(() => {
  return !commentContent.value
})
const handleClickInput = () => {
  isShowTextarea.value = true
}
const submitComment = async () => {
  const res = await addCommentApi(1, articleInfo.value.article_id, commentContent.value)
  console.log(res)
  if (res.status === 200) {
    commentContent.value = ''
    isShowTextarea.value = false
    commentList.value.commentList.unshift(res.data)
    scrollToComment()
  }
}

// 滚动至评论
const commentSection = ref(null)
const scrollToComment = () => {
  const rect = commentSection.value.getBoundingClientRect()
  const isInViewPort = rect.top >= 0 && rect.top <= window.innerHeight
  !isInViewPort && commentSection.value.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="article-page">
    <van-sticky
      ><van-nav-bar title="文章详情" class="app-nav-bar">
        <template #left>
          <span class="iconfont icon-a-44tubiao-14" @click="router.back()"></span>
        </template> </van-nav-bar
    ></van-sticky>

    <div class="article">
      <h1 class="title">{{ articleInfo.title }}</h1>
      <div class="user-info">
        <van-image
          class="user-avatar"
          round
          width="40px"
          height="40px"
          :src="articleInfo.user_info?.user_avatar || ''"
        />
        <span class="user-name">{{ articleInfo.user_info?.user_nickname || '' }}</span>
        <span class="pub-time">{{ pubtime }}</span>
        <div class="follow-btn">
          <FollowBotton :isFollow="isFollow" @click="handleFollowClick" />
        </div>
      </div>
      <div class="article-content markdown-body" v-html="articleInfo.article_info?.content || ''"></div>
    </div>
    <div class="divider"></div>
    <div class="comment" ref="commentSection">
      <div class="comment-header">
        <div class="title">评论{{ commentCount }}</div>
      </div>
      <CommentList ref="commentList" :sourceId="articleId" />
    </div>

    <div class="bottom">
      <input
        class="bottom-comment"
        v-model="commentContent"
        rows="1"
        placeholder="请输入评论"
        @click="handleClickInput"
      />
      <span class="iconfont icon-fenxiang"></span>
      <span class="iconfont icon-a-44tubiao-112" @click="scrollToComment"></span>
      <span class="iconfont icon-a-44tubiao-242"></span>
      <span class="iconfont icon-a-44tubiao-188"></span>
    </div>
    <van-back-top right="28px" bottom="80px" />

    <van-popup v-model:show="isShowTextarea" position="bottom" :style="{ height: '30%' }">
      <van-field
        v-model="commentContent"
        rows="4"
        label="评论"
        type="textarea"
        maxlength="200"
        placeholder="请输入留言"
        show-word-limit
        label-align="top"
      />

      <van-button
        :disabled="isSubmitDisabled"
        round
        size="small"
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        @click="submitComment"
        >发送</van-button
      >
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.article {
  margin: 20px 20px 100px;

  .title {
    margin-bottom: 20px;
    font-size: 42px;
  }

  .user-info {
    position: relative;
    margin-bottom: 20px;

    .user-name {
      position: absolute;
      left: 90px;
    }

    .pub-time {
      position: absolute;
      top: 48px;
      left: 90px;
      font-size: 28px;
      color: var(--text-color-2);
    }

    .follow-btn {
      position: absolute;
      top: 20px;
      right: 0px;
    }
  }
}

.divider {
  width: 750px;
  height: 12px;
  margin: 0;
  background-color: var(--bg-color-3);
}

.comment {
  margin: 20px 20px 160px;
  padding-top: 100px;

  .comment-header {
    border-bottom: 1px solid var(--bg-color-3);

    .title {
      display: inline-block;

      height: 60px;
      color: var(--main-color-red-1);
      border-bottom: 2px solid var(--main-color-red-1);
    }
  }
}

.bottom {
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  padding: 0 40px;
  background-color: var(--bg-color-1);
  border-top: 2px solid var(--bg-color-3);

  .bottom-comment {
    width: 280px;
    height: 60px;
    padding-left: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 2px solid var(--bg-color-2);
    border-radius: 30px;
    background-color: var(--bg-color-3);
  }

  .iconfont {
    font-size: 40px;
  }

  .icon-a-44tubiao-188,
  .icon-a-44tubiao-242 {
    color: var(--main-color-red-2);
  }
}

:deep(.van-button--small) {
  position: absolute;
  right: 20px;
  height: 60px;
  padding: 0 40px;
}
</style>
