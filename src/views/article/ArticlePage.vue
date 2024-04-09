<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import '@/styles/github-markdown-light.css'
import { getArticle } from '@/api'
import { convertToMMDDHHmm } from '@/utils/convert'
import ArticleComment from '@/components/article/ArticleComment.vue'

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
})
const router = useRouter()

const commentContent = ref('asddfhahjfajfjhahjf')

const articleInfo = ref({})
const pubtime = ref('')
const getArticleInfo = async () => {
  const res = await getArticle({ article_id: props.articleId })
  articleInfo.value = res.data
  pubtime.value = convertToMMDDHHmm(articleInfo.value.publish_time)
}

onMounted(() => {
  getArticleInfo()
  // await newsStore.getArticle(props.articleId)
})
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
          :src="articleInfo.user_info ? articleInfo.user_info.user_avatar : ''"
        />
        <span class="user-name">{{ articleInfo.user_info ? articleInfo.user_info.user_nickname : '' }}</span>
        <span class="pub-time">{{ pubtime }}</span>
        <van-button
          v-if="!articleInfo.is_followed"
          class="follow-btn"
          size="small"
          color="linear-gradient(to right, #ff6034, #ee0a24)"
        >
          <span class="text">关注 </span>
          <span class="iconfont icon-a-44tubiao-88"></span>
        </van-button>
        <span v-else class="iconfont icon-a-44tubiao-66 follow-btn" style="font-size: 20px"></span>
      </div>
      <div
        class="article-content markdown-body"
        v-html="articleInfo.article_info ? articleInfo.article_info.content : ''"
      ></div>
    </div>
    <div class="divider"></div>
    <div class="comment">
      <ArticleComment :sourceId="articleId"></ArticleComment>
    </div>
    <div class="bottom">
      <input class="bottom-comment" v-model="commentContent" rows="1" placeholder="请输入评论" />
      <span class="iconfont icon-fenxiang"></span>
      <span class="iconfont icon-a-44tubiao-112"></span>
      <span class="iconfont icon-a-44tubiao-242"></span>
      <span class="iconfont icon-a-44tubiao-188"></span>
    </div>
    <van-back-top right="28px" bottom="80px" />
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
      top: 10px;
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
</style>
