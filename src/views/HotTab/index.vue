<script setup>
import { ref, onMounted } from 'vue'
import { getHotListApi } from '@/api'

const hotList = ref([])
const getHotList = async () => {
  const res = await getHotListApi()
  console.log(res)
  hotList.value = res.data
}

onMounted(() => {
  getHotList()
})
</script>
<template>
  <div class="hot-tab">
    <div class="search">
      <van-search shape="round" background="#F04142" placeholder="请输入搜索关键词" />
    </div>
    <div class="caption">头条热榜</div>
    <div class="hot-list">
      <ol class="list">
        <li v-for="(item, index) in hotList" :key="item._id">
          <router-link
            :to="
              item.Type === 'article'
                ? {
                    name: 'articledetail',
                    params: {
                      articleId: item.ArticleId,
                    },
                  }
                : {
                    name: 'videodetail',
                    params: {
                      videoId: item.VideoId,
                    },
                  }
            "
          >
            <span>{{ index + 1 }}</span>
            <p>{{ item.Title }}</p>
            <img v-if="item.Label" :src="item.LabelUrl" alt="" />
          </router-link>
        </li>
      </ol>
    </div>
  </div>
</template>

<style lang="less" scoped>
.caption {
  position: relative;
  margin: 40px 0;
  padding-left: 90px;
  font-size: 33px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 40px;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 24px;
    height: 22px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABCBAMAAAAGWI0SAAAAJ1BMVEVHcEzvQEDwQULwQELxQEHwQUHvQEDwQUHvQEDwQUHwQUHwQELwQUJ3RBxpAAAADHRSTlMAI9+FW7kQ70Cgz2+lx2XXAAABmElEQVRIx7WWsU7DMBCGbWgLtAyoC0IwMCEhZWBjYQhCYmJA6oY65AEYgJmhG0Ji4AG6sDPwAF1IWkrTeyjsNCT22ecLA//SKvrknO/+u4sQpuTxSLDqQRqzUBcg3eGgAwDIOGisIHgNMzLSUJ4EoXUA/qj+CgpHdbaCIJQsWTJwFIDWfqGswdtgnvBvAzjh7qZ1R0LDGvpmMhmOfGJAKR+2UnG9OBS2kjaVdCrdiSwoLoLEld4CB+o78U9cSBXgIxB2AelH97gDLCmztNXPzIKuEJSU5bayYN8NciFajrNa6KCFEE/Fn6XPblWBe9WRlV4QdNgZunYfI+j81GM/FDdEHvvhVBr6JC9naOk1JVJd4zYNzcg0eY28QUPzCtqmIfgHqFHgXRrK/5anRhkP1G5aty8NfXlHE9I12b+olUvdkpCxs8gcLIxu2eTdG4jcmlC7fEhkzjNyiJudbEPe9+GlLdm7+caYM8IIJ0wFM+11N42ofW/ojVtT9Kbas8xNfbM8Gwy99vffS2YQ+hSRFzeP8DC4tJ/+ADFNuYdM8+umAAAAAElFTkSuQmCC)
      no-repeat 50%;
    background-size: contain;
  }
}

.hot-list {
  margin: 30px 30px 200px 30px;
  .list {
    li {
      margin-bottom: 30px;
      & > a {
        display: flex;

        span {
          text-align: center;
          display: inline-block;
          width: 40px;
          font-size: 32px;
          color: #a1a3a6;
        }
        p {
          display: inline-block;
          padding-left: 20px;
          font-size: 32px;
        }
        img {
          height: 36px;
          margin-left: 12px;
        }
      }
      &:nth-child(1) {
        span {
          color: red;
        }
      }
      &:nth-child(2) {
        span {
          color: #ff9500;
        }
      }
      &:nth-child(3) {
        span {
          color: #ffcc00;
        }
      }
    }
  }
}
</style>
