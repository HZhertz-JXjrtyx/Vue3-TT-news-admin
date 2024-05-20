<script setup>
import { ref, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { debounce } from 'lodash'
// 使用 Plyr 视频组件
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import { useUserStore, useCommentStore } from '@/stores'
import { getVideoInfoApi, collectVideoApi, likeVideoApi, addUserBrowseApi } from '@/api'
import NavBar from '@/components/NavBar.vue'
import UserInfo from '@/components/user/UserInfo.vue'
import UserInfoSkt from '@/components/user/UserInfoSkt.vue'
import CommentList from '@/components/comment/CommentList.vue'
import CommentBar from '@/components/CommentBar.vue'
import CommentDetail from '@/components/comment/CommentDetail.vue'

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
})

const userStore = useUserStore()
const commentStore = useCommentStore()

// Plyr 视频组件
const videoPlayer = ref(null)
let player
onMounted(() => {
  player = new Plyr(videoPlayer.value, {
    i18n: {
      speed: '速度',
      normal: '1x',
    },
    clickToPlay: true,
    ratio: '16:9',
    speed: { selected: 1, options: [0.25, 0.5, 1, 1.5, 2, 4] },
  })
})

/* 新增浏览历史 */
const addUserBrowse = async () => {
  await addUserBrowseApi(props.videoId, 'video')
}

/* 获取视频详情 */
const videoInfo = ref({})
const isLikeVideo = ref(false)
const isCollectVideo = ref(false)
const isLoading = ref(true)
const getVideoInfo = async () => {
  const res = await getVideoInfoApi(props.videoId)
  console.log(res)
  videoInfo.value = res.data
  // 视频封面
  player.poster = res.data.cover_src
  isCollectVideo.value = res.data.is_collected
  isLikeVideo.value = res.data.is_liked
  isLoading.value = false
}

onMounted(async () => {
  await getVideoInfo()
  commentStore.commentCount = videoInfo.value.comment_count
  commentStore.replyUser = videoInfo.value.user_info._id
  commentStore.relatedId = videoInfo.value._id
  commentStore.relatedWork = videoInfo.value._id
  commentStore.workModel = 'Video'
  userStore.token && (await addUserBrowse())
})

/* 收藏视频 */
const collectVideo = async () => {
  await collectVideoApi(videoInfo.value._id, isCollectVideo.value)
}
const debouncedCollectVideo = debounce(collectVideo, 500)
const handleClickCollect = () => {
  isCollectVideo.value = !isCollectVideo.value
  debouncedCollectVideo()
}
/* 点赞视频 */
const likeVideo = async () => {
  await likeVideoApi(videoInfo.value._id, isLikeVideo.value)
}
const debouncedLikeVideo = debounce(likeVideo, 500)
const handleClickLike = () => {
  isLikeVideo.value = !isLikeVideo.value
  debouncedLikeVideo()
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
  <div class="video-page">
    <NavBar title="视频详情" />

    <div class="video">
      <UserInfo v-if="!isLoading" :userInfo="videoInfo.user_info" :publishTime="videoInfo.publish_time" />
      <UserInfoSkt v-if="isLoading" />
      <h1 class="title">{{ videoInfo.title }}</h1>
      <p class="description">{{ videoInfo.description }}</p>
      <video ref="videoPlayer">
        <source v-if="videoInfo.video_src" :src="videoInfo.video_src" type="video/mp4" />
      </video>
    </div>
    <div class="divider"></div>
    <div class="comment" ref="commentSection">
      <div class="comment-header">
        <div class="title">评论{{ commentStore.commentCount }}</div>
      </div>
      <CommentList :commentType="2" :relatedId="videoId" />
    </div>

    <van-back-top right="28px" bottom="80px" />
    <CommentBar
      v-if="!isLoading"
      :commentType="2"
      :relatedId="videoId"
      :replyUser="videoInfo.user_info._id"
      :isLike="isLikeVideo"
      :isCollect="isCollectVideo"
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
.video {
  margin: 20px 20px 100px;

  .title {
    margin-bottom: 20px;
    font-size: 36px;
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
