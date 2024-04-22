<script setup>
import { ref, onMounted, provide } from 'vue'
import { debounce } from 'lodash'
// 使用 Plyr 视频组件
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import { getVideoInfoApi, collectVideoApi, likeVideoApi } from '@/api'
import NavBar from '@/components/NavBar.vue'
import UserInfo from '@/components/user/UserInfo.vue'
import UserInfoSkt from '@/components/user/UserInfoSkt.vue'
import CommentList from '@/components/comment/CommentList.vue'
import DetailBottom from '@/components/DetailBottom.vue'

const props = defineProps({
  videoId: {
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

/* 获取视频详情 */
const videoInfo = ref({})
const isLoading = ref(true)
const getVideoInfo = async () => {
  const res = await getVideoInfoApi(props.videoId)
  console.log(res)
  videoInfo.value = res.data
  // 视频封面
  player.poster = res.data.video_info.image_url
  commentCount.value = res.data.comment_count
  isCollected.value = res.data.is_collected
  isLike.value = res.data.is_liked
  isLoading.value = false
}

onMounted(() => {
  getVideoInfo()
})

/* 收藏视频 */
const collectVideo = async () => {
  await collectVideoApi(videoInfo.value.video_id, isCollected.value)
}
const debouncedCollectVideo = debounce(collectVideo, 500)
const handleClickCollect = () => {
  isCollected.value = !isCollected.value
  debouncedCollectVideo()
}
/* 点赞视频 */
const likeVideo = async () => {
  await likeVideoApi(videoInfo.value.video_id, isLike.value)
}
const debouncedLikeVideo = debounce(likeVideo, 500)
const handleClickLike = () => {
  isLike.value = !isLike.value
  debouncedLikeVideo()
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
  <div class="video-page">
    <NavBar title="视频详情" />

    <div class="video">
      <UserInfo v-if="!isLoading" :userInfo="videoInfo.user_info" :publishTime="videoInfo.publish_time" />
      <UserInfoSkt v-if="isLoading" />
      <h1 class="title">{{ videoInfo.title }}</h1>
      <p class="description">{{ videoInfo.video_info?.description }}</p>
      <video ref="videoPlayer">
        <source v-if="videoInfo.video_info" :src="videoInfo.video_info?.src.src" type="video/mp4" />
      </video>
    </div>
    <div class="divider"></div>
    <div class="comment" ref="commentSection">
      <div class="comment-header">
        <div class="title">评论{{ commentCount }}</div>
      </div>
      <CommentList :type="2" :sourceId="videoId" />
    </div>

    <van-back-top right="28px" bottom="80px" />
    <DetailBottom
      v-if="!isLoading"
      :sourceType="2"
      :sourceId="props.videoId"
      @clickLike="handleClickLike"
      @clickCollect="handleClickCollect"
      @scrollTo="scrollToComment"
    />
  </div>
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
