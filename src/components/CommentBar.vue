<script setup>
import { ref, computed } from 'vue'
import { useCommentStore } from '@/stores'

const props = defineProps({
  commentType: {
    type: Number,
    required: true,
  },
  relatedId: {
    type: String,
    required: true,
  },
  replyUser: {
    type: String,
    required: true,
  },
  replyName: {
    type: String,
    required: false,
  },
  isLike: {
    type: Boolean,
    required: true,
  },
  isCollect: {
    type: Boolean,
    required: false,
  },
})
const emit = defineEmits(['scrollTo', 'clickCollect', 'clickLike'])

const commentStore = useCommentStore()

/* 发起评论 */
// 评论内容
const commentContent = ref('')
// 内容为空时，发送按钮不可用
const isSubmitDisabled = computed(() => {
  return !commentContent.value
})
// 点击 input 显示 popup , 更改 pinia 中数据
const clickInput = () => {
  // 更改 placeholder
  commentStore.textareaPlaceholder = props.commentType !== 3 ? '请输入评论' : `回复${props.replyName}:`
  // 显示 popup
  commentStore.isShowTextarea = true
  // 1: 文章评论 2: 视频评论 3: 评论回复 4: 回复回复
  commentStore.commentType = props.commentType
  // 页面id
  commentStore.relatedId = props.relatedId

  commentStore.replyUser = props.replyUser
}
// 提交
const submit = async () => {
  // 提交评论后会返回评论数据
  const res = await commentStore.submitComment(commentContent.value)
  console.log(res)
  if (res.status === 200) {
    // 清空
    commentContent.value = ''
    // 关闭 popup
    commentStore.isShowTextarea = false
    // 如果不是在评论详情页
    if (!commentStore.isShowCommentDetail) {
      // 如果不是对评论回复
      if ([1, 2].includes(res.data.comment_type)) {
        // 将返回的数据添加在列表头部
        commentStore.commentList.unshift(res.data)
        // 更新数量
        commentStore.commentCount++
        emit('scrollTo')
      } else {
        // 如果是对评论回复,找到回复项,添加在回复项 replies 头部
        const replyIndex = commentStore.commentList.findIndex((item) => {
          return item._id === res.data.related_entity
        })
        commentStore.commentList[replyIndex].replies.unshift(res.data)
        commentStore.commentReplyList.length > 0 && commentStore.commentReplyList.unshift(res.data)
        commentStore.replyCount++
        commentStore.commentCount++
      }
    } else {
      // 如果是在评论详情页,将返回的数据添加在列表头部
      commentStore.commentReplyList.unshift(res.data)
      const replyIndex = commentStore.commentList.findIndex((item) => {
        return item._id === res.data.related_entity
      })
      commentStore.commentList[replyIndex].replies.unshift(res.data)
      commentStore.replyCount++
      commentStore.commentCount++
    }
  }
}
/* 分享面板 */
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
/* 点击评论 */
const clickComment = () => {
  if (props.commentType === 3) {
    clickInput()
  } else {
    emit('scrollTo')
  }
}
</script>

<template>
  <div class="detail-bottom">
    <div class="bottom">
      <span
        class="iconfont"
        :class="isLike ? 'icon-like_fill' : 'icon-like'"
        v-login="
          () => {
            emit('clickLike')
          }
        "
      ></span>
      <span
        v-if="commentType !== 3"
        class="iconfont"
        :class="isCollect ? 'icon-favorite_fill' : 'icon-favorite'"
        v-login="
          () => {
            emit('clickCollect')
          }
        "
      ></span>
      <span class="iconfont icon-message" v-login="clickComment"></span>
      <span class="iconfont icon-share" v-login="() => (isShowShare = true)"></span>
      <input
        class="bottom-comment"
        v-model="commentContent"
        rows="1"
        placeholder="请输入评论"
        v-login="clickInput"
        readonly
      />
    </div>
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
        clearable
        clear-trigger="always"
      />

      <van-button
        :disabled="isSubmitDisabled"
        round
        size="small"
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        @click="submit"
        >发送</van-button
      >
    </van-popup>
    <!-- 分享面板 -->
    <van-share-sheet v-model:show="isShowShare" title="立即分享给好友" :options="options" />
  </div>
</template>

<style lang="less" scoped>
.bottom {
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  height: 100px;
  padding: 0 40px;
  background-color: var(--bg-color-1);
  border-top: 2px solid var(--bg-color-3);

  .bottom-comment {
    flex: 1;

    height: 60px;
    padding: 0 26px;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 2px solid var(--bg-color-2);
    border-radius: 30px;
    background-color: var(--bg-color-3);
  }

  .iconfont {
    margin-left: 60px;
    font-size: 40px;
  }
}
.commentPopup {
  box-shadow: 0 -5px 5px rgb(242, 242, 242);
  :deep(.van-button--small) {
    position: absolute;
    right: 20px;
    height: 60px;
    padding: 0 40px;
  }
}
:deep(.van-field__clear) {
  position: absolute;
  right: 0;
  top: -50px;
}
.van-overlay {
  background: #ffffff00;
}
</style>
