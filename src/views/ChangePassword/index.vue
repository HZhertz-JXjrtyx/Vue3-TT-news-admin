<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import 'vant/es/toast/style'
import { useUserStore } from '@/stores'
import { getUserBindApi, sendCodeApi, changeUserPwdApi } from '@/api'
import NavBar from '@/components/NavBar.vue'

const userStore = useUserStore()

const changePwdForm = ref({
  oldPwd: '',
  newPwd: '',
  confirmNewPwd: '',
  code: '',
})
const changePwdFormRules = {
  oldPwd: [{ required: true, message: '密码不能为空', trigger: 'onSubmit' }],
  newPwd: [
    { required: true, message: '密码不能为空', trigger: 'onSubmit' },
    {
      pattern: /^\S*(?=\S{6,20})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*?])\S*$/,
      message: '请输入6-20位密码包含大小写和数字和特殊符号',
      trigger: 'onSubmit',
    },
  ],
  code: [
    { required: true, message: '验证码不能为空', trigger: 'onSubmit' },
    { pattern: /^\d{6}$/, message: '验证码格式错误', trigger: 'onSubmit' },
  ],
}

// 获取用户绑定信息
const userBindInfo = ref({})
const getUserBindInfo = async () => {
  const res = await getUserBindApi()
  console.log(res)
  userBindInfo.value = res.data
}
onMounted(() => {
  getUserBindInfo()
})

// 验证新旧密码一致
const verifyConsistent = () => {
  if (changePwdForm.value.newPwd !== changePwdForm.value.confirmNewPwd) {
    showToast({
      message: '密码不一致',
      position: 'bottom',
    })
    return Promise.reject({ message: '密码不一致' })
  }
}
// 发送验证码
const changePwdFormRef = ref(null)
const isCountDownShow = ref(false)
const time = ref(1000 * 60)
const onSendCode = async () => {
  try {
    await changePwdFormRef.value.validate(['oldPwd', 'newPwd', 'confirmNewPwd'])
    await verifyConsistent()
    await sendCodeApi(userStore.userInfo.user_name, userBindInfo.value.user_email, 'changePwd')
    showToast({
      message: '验证码已发送至邮箱',
      position: 'bottom',
    })
    isCountDownShow.value = true
  } catch (error) {
    console.log(error)
  }
}

// 提交
const changePwdSubmit = async () => {
  await changePwdFormRef.value.validate(['oldPwd', 'newPwd', 'confirmNewPwd', 'code'])
  await verifyConsistent()
  const res = await changeUserPwdApi(
    changePwdForm.value.oldPwd,
    changePwdForm.value.newPwd,
    changePwdForm.value.code
  )
  console.log(res)
  if (res.status === 200) {
    changePwdForm.value = {
      oldPwd: '',
      newPwd: '',
      confirmNewPwd: '',
      code: '',
    }
    isCountDownShow.value = false
  }
}
</script>

<template>
  <NavBar title="修改密码" />
  <van-form ref="changePwdFormRef" @submit="changePwdSubmit" @keydown.enter.prevent>
    <van-field
      v-model="changePwdForm.oldPwd"
      name="oldPwd"
      type="password"
      placeholder="请输入旧密码"
      :rules="changePwdFormRules.oldPwd"
      maxlength="20"
      center
    >
      <template #left-icon>
        <span class="iconfont icon-a-44tubiao-33"></span>
      </template>
    </van-field>
    <van-field
      v-model="changePwdForm.newPwd"
      name="newPwd"
      type="password"
      placeholder="请输入新密码"
      :rules="changePwdFormRules.newPwd"
      maxlength="20"
      center
    >
      <template #left-icon>
        <span class="iconfont icon-a-44tubiao-33"></span>
      </template>
    </van-field>
    <van-field
      v-model="changePwdForm.confirmNewPwd"
      name="confirmNewPwd"
      type="password"
      placeholder="请确认密码"
      :rules="changePwdFormRules.newPwd"
      maxlength="20"
      center
    >
      <template #left-icon>
        <span class="iconfont icon-a-44tubiao-33"></span>
      </template>
    </van-field>

    <van-field
      v-model="changePwdForm.code"
      name="code"
      placeholder="请输入验证码"
      :rules="changePwdFormRules.code"
      type="number"
      maxlength="6"
      size="large"
      center
    >
      <template #left-icon>
        <span class="iconfont icon-a-44tubiao-114"></span>
      </template>
      <template #button>
        <van-count-down v-if="isCountDownShow" @finish="isCountDownShow = false" :time="time" format="ss s" />

        <van-button v-else @click="onSendCode" class="send-btn" size="mini" round>发送验证码</van-button>
      </template>
    </van-field>
    <div class="submit-btn-wrap">
      <van-button type="info" native-type="submit" block class="submit-btn">提交</van-button>
    </div>
  </van-form>
</template>

<style lang="less" scoped>
.send-btn {
  background-color: #ededed;
  color: #666;
}
.submit-btn-wrap {
  padding: 74px 54px;

  .submit-btn {
    background-color: #f04142;
    color: #fff;
    border: none !important;
  }
}
</style>
