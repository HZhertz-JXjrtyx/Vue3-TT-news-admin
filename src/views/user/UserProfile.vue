<template>
  <div>UserProfile</div>
  <van-field name="gender" label="性别">
    <template #left-icon>
      <span class="iconfont icon-a-44tubiao-93"></span>
    </template>
    <template #input>
      <van-radio-group v-model="registerInfo.gender" direction="horizontal">
        <van-radio :name="1" icon-size="18px"
          ><span class="iconfont icon-a-44tubiao-161"></span
        ></van-radio>
        <van-radio :name="0" icon-size="18px"
          ><span class="iconfont icon-a-44tubiao-162"></span
        ></van-radio>
      </van-radio-group>
    </template>
  </van-field>
</template>

<script setup>
import { ref } from 'vue'
const registerInfo = ref({
  gender: 1
})
</script>
<style lang="less" scoped></style>
