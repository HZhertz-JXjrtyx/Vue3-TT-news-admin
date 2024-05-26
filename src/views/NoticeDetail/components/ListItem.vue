<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import { isFollowUserApi, followUserApi } from '@/api'
import { formatTimeAccurately } from '@/utils'

const props = defineProps({
  notice: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

// 跳转用户详情页
const goUserSpace = () => {
  router.push({
    name: 'userspace',
    params: {
      userId: props.notice.sender.user_id,
    },
  })
}

// 是否关注
const isFollow = ref(false)
const getIsFollow = async () => {
  const res = await isFollowUserApi(props.notice.related_entity.user_id)
  console.log(res)
  isFollow.value = res.result
}
onMounted(() => {
  props.notice.type === 'follow' && getIsFollow()
})

// 关注、取消关注
const followUser = async () => {
  await followUserApi(props.notice.related_entity.user_id, isFollow.value)
}
const debouncedFollowUser = debounce(followUser, 500)
const handleFollow = () => {
  isFollow.value = !isFollow.value
  debouncedFollowUser()
}
</script>
<template>
  <div class="notice-item">
    <div class="item-left">
      <div class="left__user-avatar">
        <van-image
          round
          fit="cover"
          position="center"
          :src="notice.sender.user_avatar"
          @click.stop="goUserSpace"
        />
      </div>
    </div>
    <div class="item-center">
      <div class="center__notice">
        <span class="notice__user-nickname" @click.stop="goUserSpace">
          {{ notice.sender.user_nickname }}&nbsp;
        </span>
        <span class="notice__description"> {{ notice.content }}</span>
      </div>
      <span class="center__content" v-if="notice.type === 'comment'">{{
        notice.related_content.content
      }}</span>
      <span class="center__create-at">{{ formatTimeAccurately(notice.created_at) }}</span>
    </div>
    <div class="item-right">
      <div class="right__preview">
        <div class="preview__article" v-if="notice.entity_type === 'Article'">
          <div class="preview__article--img preview--img" v-if="notice.related_entity.cover_list[0]">
            <van-image fit="cover" position="center" :src="notice.related_entity.cover_list[0]" />
          </div>
          <div class="preview__article--text preview--text" v-else>{{ notice.related_entity.title }}</div>
        </div>
        <div class="preview__video" v-if="notice.entity_type === 'Video'">
          <div class="preview__video--img preview--img">
            <van-image fit="cover" position="center" :src="notice.related_entity.cover_src" />
          </div>
        </div>
        <div class="preview__comment" v-if="notice.entity_type === 'Comment'">
          <div class="preview__Comment--text preview--text">
            {{ notice.related_entity.content }}
          </div>
        </div>
      </div>
      <div class="follow-btn" v-if="notice.entity_type === 'User'">
        <van-button
          v-if="!isFollow"
          size="small"
          color="linear-gradient(to right, #ff6034, #ee0a24)"
          @click.stop="handleFollow"
        >
          <span class="text">回关</span>
        </van-button>
        <van-button v-else class="isfollow" size="small" color="#ddd" @click.stop="handleFollow">
          <span class="text">已关注</span>
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.notice-item {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.item-left {
  .left__user-avatar {
    width: 100px;
    height: 100px;
    margin: 20px 30px;
    .van-image {
      width: 100%;
      height: 100%;
    }
  }
}
.item-center {
  margin: 20px 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
  .center__notice {
    width: 420px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    .notice__user-nickname {
      font-weight: 600;
    }
  }
  .center__content {
    width: 420px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: rgb(106, 106, 106);
  }
  .center__create-at {
    font-size: 22px;
    color: #797979;
  }
}
.item-right {
  .right__preview {
    margin: 10px 20px 10px 0;
    .preview--img {
      width: 140px;
      height: 120px;
      .van-image {
        width: 100%;
        height: 100%;
      }
    }
    .preview--text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
      width: 140px;
      height: 120px;
      overflow: hidden;
      padding: 10px;

      font-size: 24px;
      line-height: 1.11;
      background-color: #f1f1f1;
      color: rgb(105, 105, 105);
    }
  }
  .follow-btn {
    width: 160px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-button {
      width: 120px;
    }
  }
}
</style>
