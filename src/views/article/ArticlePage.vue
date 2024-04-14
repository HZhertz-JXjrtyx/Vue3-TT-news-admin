<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import '@/styles/github-markdown-light.css'
import { useCommentStore } from '@/stores'
import { getArticle, followUserApi, addCommentApi, collectArticleApi, likeArticleApi } from '@/api'
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
const commentStore = useCommentStore()

// 获取文章详情
const articleInfo = ref({})
const pubtime = ref('')
const isFollow = ref(false)
const isCollected = ref(false)
const isLike = ref(false)
// const commentCount = commentStore.commentCount
// provide('commentCount', commentCount)
const getArticleInfo = async () => {
  const res = await getArticle({ article_id: props.articleId })
  console.log(res)
  articleInfo.value = res.data
  pubtime.value = convertToMMDDHHmm(articleInfo.value.publish_time)
  isFollow.value = res.data.is_followed
  isCollected.value = res.data.is_collected
  isLike.value = res.data.is_liked
  commentStore.commentCount = res.data.comment_count
}

onMounted(() => {
  getArticleInfo()
})
// 关注
const followUser = async () => {
  await followUserApi(articleInfo.value.user_info.user_id, isFollow.value)
}
const debouncedFollowUser = debounce(followUser, 500)
const handleFollowClick = () => {
  isFollow.value = !isFollow.value
  debouncedFollowUser()
}

// 评论

const commentList = ref(null)

const commentContent = ref('')

const isSubmitDisabled = computed(() => {
  return !commentContent.value
})
const handleClickInput = () => {
  commentStore.textareaPlaceholder = '请输入评论'
  commentStore.isShowTextarea = true
  commentStore.typeParam = 1
  commentStore.sourceidParam = articleInfo.value.article_id
}
const submitComment = async () => {
  const res = await addCommentApi(
    commentStore.typeParam,
    commentStore.sourceidParam,
    commentContent.value,
    commentStore.replyUseridParam
  )
  console.log(res)
  if (res.status === 200) {
    commentContent.value = ''
    commentStore.commentCount++
    commentStore.isShowTextarea = false
    if (res.data.type === 3) {
      const replyIndex = commentList.value.commentList.findIndex((item) => {
        return item.comment_id === res.data.source_id
      })
      commentList.value.commentList[replyIndex].replies.unshift(res.data)
    } else {
      commentList.value.commentList.unshift(res.data)
    }

    scrollToComment()
  }
}
// 分享面板
const isShowShare = ref(false)
const options = [
  [
    { name: '微信', icon: 'wechat' },
    { name: '朋友圈', icon: 'wechat-moments' },
    { name: '微博', icon: 'weibo' },
    { name: 'QQ', icon: 'qq' },
  ],
  [
    { name: '复制链接', icon: 'link' },
    { name: '分享海报', icon: 'poster' },
    { name: '二维码', icon: 'qrcode' },
    { name: '小程序码', icon: 'weapp-qrcode' },
  ],
]

// 收藏文章
const collectArticle = async () => {
  await collectArticleApi(articleInfo.value.article_id, isCollected.value)
}
const debouncedCollectArticle = debounce(collectArticle, 500)
const handleCollectClick = () => {
  isCollected.value = !isCollected.value
  debouncedCollectArticle()
}
// 点赞文章
const likeArticle = async () => {
  await likeArticleApi(articleInfo.value.article_id, isLike.value)
}
const debouncedLikeArticle = debounce(likeArticle, 500)
const handleLikeClick = () => {
  isLike.value = !isLike.value
  debouncedLikeArticle()
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
          <FollowBotton :isFollow="isFollow" v-login="handleFollowClick" />
        </div>
      </div>
      <div class="article-content markdown-body" v-html="articleInfo.article_info?.content || ''"></div>
    </div>
    <div class="divider"></div>
    <div class="comment" ref="commentSection">
      <div class="comment-header">
        <div class="title">评论{{ commentStore.commentCount }}</div>
      </div>
      <CommentList ref="commentList" :type="1" :sourceId="articleId" />
    </div>

    <div class="bottom">
      <input
        class="bottom-comment"
        v-model="commentContent"
        rows="1"
        placeholder="请输入评论"
        v-login="handleClickInput"
      />
      <span class="iconfont icon-fenxiang" @click="isShowShare = true"></span>
      <span class="iconfont icon-a-44tubiao-112" @click="scrollToComment"></span>
      <span
        class="iconfont"
        :class="isCollected ? 'icon-a-44tubiao-242' : 'icon-a-44tubiao-134'"
        v-login="handleCollectClick"
      ></span>
      <span
        class="iconfont"
        :class="isLike ? 'icon-a-44tubiao-188' : 'icon-a-44tubiao-21'"
        v-login="handleLikeClick"
      ></span>
    </div>
    <van-back-top right="28px" bottom="80px" />

    <van-popup
      class="commentPopup"
      v-model:show="commentStore.isShowTextarea"
      round
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-field
        v-model="commentContent"
        rows="4"
        label="评论"
        type="textarea"
        maxlength="200"
        :placeholder="commentStore.textareaPlaceholder"
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
    <!-- 分享面板 -->
    <van-share-sheet v-model:show="isShowShare" title="立即分享给好友" :options="options" />
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
.commentPopup {
  :deep(.van-button--small) {
    position: absolute;
    right: 20px;
    height: 60px;
    padding: 0 40px;
  }
}
</style>
