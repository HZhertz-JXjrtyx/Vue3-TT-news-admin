<script setup>
import { ref, onMounted } from 'vue'
import '@/styles/github-markdown-light.css'
// import { convertToMMDDHHmm } from '@/utils/convert'
import ArticleComment from '@/components/article/ArticleComment.vue'

defineProps({
  articleId: {
    type: String,
    required: true,
  },
})

const pubtime = ref('')
const commentContent = ref('asddfhahjfajfjhahjf')

onMounted(async () => {
  // await newsStore.getArticle(props.articleId)
  // pubtime.value = convertToMMDDHHmm(newsStore.article.publish_time)
})
</script>

<template>
  <div class="article-page">
    <van-sticky
      ><van-nav-bar title="文章详情" class="app-nav-bar">
        <template #left>
          <span class="iconfont icon-a-44tubiao-14" @click="$router.back()"></span>
        </template> </van-nav-bar
    ></van-sticky>

    <div class="article">
      <!-- <h1 class="title">{{ newsStore.article.title }}</h1> -->
      <div class="user-info">
        <van-image
          class="user-avatar"
          round
          width="40px"
          height="40px"
          :src="newsStore.article.user_info ? newsStore.article.user_info.user_avatar : ''"
        />
        <span class="user-name">{{
          newsStore.article.user_info ? newsStore.article.user_info.user_nickname : ''
        }}</span>
        <span class="pub-time">{{ pubtime }}</span>
        <van-button
          v-if="!newsStore.article.is_followed"
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
        v-html="newsStore.article.article_info ? newsStore.article.article_info.content : ''"
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
  margin: 10px 10px 50px;
  .title {
    margin-bottom: 10px;
    font-size: 22px;
  }
  .user-info {
    position: relative;

    .user-name {
      position: absolute;
      left: 45px;
    }
    .pub-time {
      position: absolute;
      top: 24px;
      left: 45px;
      font-size: 14px;
      color: var(--text-color-2);
    }
    .follow-btn {
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
}
.divider {
  width: 375px;
  height: 6px;
  margin: 0;
  background-color: var(--bg-color-3);
}
.comment {
  margin: 10px 10px 80px;
}
.bottom {
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding: 0 20px;
  background-color: var(--bg-color-1);
  border-top: 1px solid var(--bg-color-3);
  .bottom-comment {
    width: 140px;
    height: 30px;
    padding-left: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 1px solid var(--bg-color-2);
    border-radius: 15px;
    background-color: var(--bg-color-3);
  }
  .iconfont {
    font-size: 20px;
  }
  .icon-a-44tubiao-188,
  .icon-a-44tubiao-242 {
    color: var(--main-color-red-2);
  }
}
</style>
