<script setup>
import { ref, computed, inject } from 'vue'
import { useCommentStore } from '@/stores'

const props = defineProps({
  sourceType: {
    type: Number,
    required: true,
  },
  sourceId: {
    type: String,
    required: true,
  },
  replyName: {
    type: String,
    required: false,
  },
})
const emit = defineEmits(['scrollTo', 'clickCollect', 'clickLike'])

let isCollected
if (props.sourceType !== 3) {
  isCollected = inject('isCollected')
}
const isLike = inject('isLike')
// 评论popup显示隐藏
const isShowTextarea = inject('isShowTextarea')
// 评论数量
const commentCount = inject('commentCount')
// commentList 用来提交评论后更新评论列表
const commentList = inject('commentList')

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
  commentStore.textareaPlaceholder = props.sourceType !== 3 ? '请输入评论' : `回复${props.replyName}:`
  // 显示 popup
  isShowTextarea.value = true
  // 页面类型 1：文章详情页 2：视频详情页 3：评论详情页
  commentStore.typeParam = props.sourceType
  // 页面id
  commentStore.sourceidParam = props.sourceId
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
    isShowTextarea.value = false
    // 如果不是在评论详情页
    if (props.sourceType !== 3) {
      // 如果不是对评论回复
      if (res.data.type !== 3) {
        // 将返回的数据添加在列表头部
        commentList.value.unshift(res.data)
        // 更新数量
        commentCount.value++
        emit('scrollTo')
      } else {
        // 如果是对评论回复,找到回复项,添加在回复项 replies 头部
        const replyIndex = commentList.value.findIndex((item) => {
          return item.comment_id === res.data.source_id
        })
        commentList.value[replyIndex].replies.unshift(res.data)
        commentList.value[replyIndex].reply_count++
        commentCount.value++
      }
    } else {
      // 如果是在评论详情页,将返回的数据添加在列表头部
      commentList.value.unshift(res.data)
      commentCount.value++
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
  if (props.sourceType === 3) {
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
        :class="isLike ? 'icon-a-44tubiao-188' : 'icon-a-44tubiao-21'"
        v-login="
          () => {
            emit('clickLike')
          }
        "
      ></span>
      <span
        v-if="sourceType !== 3"
        class="iconfont"
        :class="isCollected ? 'icon-a-44tubiao-242' : 'icon-a-44tubiao-134'"
        v-login="
          () => {
            emit('clickCollect')
          }
        "
      ></span>
      <span class="iconfont icon-a-44tubiao-112" v-login="clickComment"></span>
      <span class="iconfont icon-fenxiang" v-login="() => (isShowShare = true)"></span>
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
      v-model:show="isShowTextarea"
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
</style>
