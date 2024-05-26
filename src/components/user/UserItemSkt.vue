<script setup></script>

<template>
  <div class="user-item-skt">
    <van-skeleton>
      <template #template>
        <div :style="{ display: 'flex', width: '100%' }">
          <van-skeleton-avatar />
          <div :style="{ flex: 2 }">
            <van-skeleton-paragraph row-width="20%" />
            <van-skeleton-paragraph row-width="40%" />
          </div>
          <div class="btn-skt" :style="{ flex: 1 }">
            <van-skeleton-paragraph />
          </div>
        </div>
      </template>
    </van-skeleton>
  </div>
</template>

<style lang="less" scoped>
.user-item-skt {
  margin: 20px;
}

.van-skeleton {
  padding: 0;
  // margin-bottom: 20px;
}

.van-skeleton-avatar {
  width: 100px;
  height: 100px;
}
.btn-skt {
  position: relative;
  .van-skeleton-paragraph {
    position: absolute;
    right: 0;
    bottom: 14px;
    width: 130px !important;
    height: 60px;
    border-radius: 10px;
  }
}
</style>
