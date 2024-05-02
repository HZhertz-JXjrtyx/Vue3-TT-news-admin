<script setup>
import { ref, onMounted, provide } from 'vue'
import { debounce } from 'lodash'
import { getArticleInfoApi, collectArticleApi, likeArticleApi, addUserBrowseApi } from '@/api'
import '@/styles/github-markdown-light.less'
import NavBar from '@/components/NavBar.vue'
import UserInfo from '@/components/user/UserInfo.vue'
import UserInfoSkt from '@/components/user/UserInfoSkt.vue'
import CommentList from '@/components/comment/CommentList.vue'
import DetailBottom from '@/components/DetailBottom.vue'

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
})

const commentCount = ref(0)
provide('commentCount', commentCount)
const commentList = ref([])
provide('commentList', commentList)
const isShowTextarea = ref(false)
provide('isShowTextarea', isShowTextarea)
const isLike = ref(false)
provide('isLike', isLike)
const isCollected = ref(false)
provide('isCollected', isCollected)

/* 新增浏览历史 */
const addUserBrowse = async () => {
  await addUserBrowseApi(props.articleId, 'article')
}

/* 获取文章详情 */
const articleInfo = ref({})
const isLoading = ref(true)
const getArticleInfo = async () => {
  const res = await getArticleInfoApi(props.articleId)
  console.log(res)
  articleInfo.value = res.data
  commentCount.value = res.data.comment_count
  isCollected.value = res.data.is_collected
  isLike.value = res.data.is_liked
  isLoading.value = false
}

onMounted(() => {
  getArticleInfo()
  addUserBrowse()
})

/* 收藏文章 */
const collectArticle = async () => {
  await collectArticleApi(articleInfo.value.article_id, isCollected.value)
}
const debouncedCollectArticle = debounce(collectArticle, 500)
const handleClickCollect = () => {
  isCollected.value = !isCollected.value
  debouncedCollectArticle()
}
/* 点赞文章 */
const likeArticle = async () => {
  await likeArticleApi(articleInfo.value.article_id, isLike.value)
}
const debouncedLikeArticle = debounce(likeArticle, 500)
const handleClickLike = () => {
  isLike.value = !isLike.value
  debouncedLikeArticle()
}

/* 滚动至评论 */
const commentSection = ref(null)
const scrollToComment = () => {
  const rect = commentSection.value.getBoundingClientRect()
  const isInViewPort = rect.top >= 0 && rect.top <= window.innerHeight
  !isInViewPort && commentSection.value.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="article-detail">
    <NavBar title="文章详情" />

    <div class="article">
      <h1 class="title">{{ articleInfo.title }}</h1>
      <UserInfo v-if="!isLoading" :userInfo="articleInfo.user_info" :publishTime="articleInfo.publish_time" />
      <UserInfoSkt v-if="isLoading" />
      <div class="article-content markdown-body" v-html="articleInfo.article_info?.content || ''"></div>
    </div>
    <div class="divider"></div>
    <div class="comment" ref="commentSection">
      <div class="comment-header">
        <div class="title">评论{{ commentCount }}</div>
      </div>
      <CommentList :type="1" :sourceId="articleId" />
    </div>

    <van-back-top right="28px" bottom="80px" />
    <DetailBottom
      v-if="!isLoading"
      :sourceType="1"
      :sourceId="props.articleId"
      @clickLike="handleClickLike"
      @clickCollect="handleClickCollect"
      @scrollTo="scrollToComment"
    />
  </div>
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
