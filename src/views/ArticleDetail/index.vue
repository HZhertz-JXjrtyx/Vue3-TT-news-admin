<script setup>
import { ref, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { debounce } from 'lodash'
import { useUserStore, useCommentStore } from '@/stores'
import { getArticleInfoApi, collectArticleApi, likeArticleApi, addUserBrowseApi } from '@/api'
import '@/styles/github-markdown-light.less'
import NavBar from '@/components/NavBar.vue'
import UserInfo from '@/components/user/UserInfo.vue'
import UserInfoSkt from '@/components/user/UserInfoSkt.vue'
import CommentList from '@/components/comment/CommentList.vue'
import CommentBar from '@/components/CommentBar.vue'
import CommentDetail from '@/components/comment/CommentDetail.vue'

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
})

const userStore = useUserStore()
const commentStore = useCommentStore()

/* 新增浏览历史 */
const addUserBrowse = async () => {
  await addUserBrowseApi(props.articleId, 'article')
}

/* 获取文章详情 */
const articleInfo = ref({})
const isLikeArticle = ref(false)
const isCollectArticle = ref(false)
const isLoading = ref(true)
const getArticleInfo = async () => {
  const res = await getArticleInfoApi(props.articleId)
  console.log(res)
  articleInfo.value = res.data
  isLikeArticle.value = res.data.is_liked
  isCollectArticle.value = res.data.is_collected
  isLoading.value = false
}

onMounted(async () => {
  await getArticleInfo()
  commentStore.commentCount = articleInfo.value.comment_count
  commentStore.replyUser = articleInfo.value.user_info._id
  commentStore.relatedId = articleInfo.value._id
  userStore.token && (await addUserBrowse())
})

/* 收藏文章 */
const collectArticle = async () => {
  await collectArticleApi(articleInfo.value._id, isCollectArticle.value)
}
const debouncedCollectArticle = debounce(collectArticle, 500)
const handleClickCollect = () => {
  isCollectArticle.value = !isCollectArticle.value
  debouncedCollectArticle()
}
/* 点赞文章 */
const likeArticle = async () => {
  await likeArticleApi(articleInfo.value._id, isLikeArticle.value)
}
const debouncedLikeArticle = debounce(likeArticle, 500)
const handleClickLike = () => {
  isLikeArticle.value = !isLikeArticle.value
  debouncedLikeArticle()
}

/* 滚动至评论 */
const commentSection = ref(null)
const scrollToComment = () => {
  const rect = commentSection.value.getBoundingClientRect()
  const isInViewPort = rect.top >= 0 && rect.top <= window.innerHeight
  !isInViewPort && commentSection.value.scrollIntoView({ behavior: 'smooth' })
}
onBeforeRouteLeave(() => {
  commentStore.commentList = []
  commentStore.commentReplyList = []
})
</script>

<template>
  <div class="article-detail">
    <NavBar title="文章详情" />

    <div class="article">
      <h1 class="title">{{ articleInfo.title }}</h1>
      <UserInfo v-if="!isLoading" :userInfo="articleInfo.user_info" :publishTime="articleInfo.publish_time" />
      <UserInfoSkt v-if="isLoading" />
      <div class="article-content markdown-body" v-html="articleInfo.content || ''"></div>
    </div>
    <div class="divider"></div>
    <div class="comment" ref="commentSection">
      <div class="comment-header">
        <div class="title">评论{{ commentStore.commentCount }}</div>
      </div>
      <CommentList :commentType="1" :relatedId="articleId" />
    </div>

    <van-back-top right="28px" bottom="80px" />
    <CommentBar
      v-if="!isLoading"
      :commentType="1"
      :relatedId="articleId"
      :isLike="isLikeArticle"
      :isCollect="isCollectArticle"
      @clickLike="handleClickLike"
      @clickCollect="handleClickCollect"
      @scrollTo="scrollToComment"
    />
  </div>
  <van-popup v-model:show="commentStore.isShowCommentDetail" position="bottom" :style="{ height: '100%' }">
    <CommentDetail />
  </van-popup>
</template>

<style lang="less" scoped>
.article {
  margin: 20px 20px 100px;

  .title {
    margin-bottom: 20px;
    font-size: 42px;
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
</style>
