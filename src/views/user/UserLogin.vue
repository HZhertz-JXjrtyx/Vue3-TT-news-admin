<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import 'vant/es/toast/style'
import { debounce } from 'lodash'
import { login, register, isOnlyName, sendCode } from '@/api'
import { useUserStore, useChannelStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()
const channelStore = useChannelStore()
const status = ref('登录')
const errorMessage = ref('')
const isCountDownShow = ref(false)
const time = ref(1000 * 60)
const loginInfo = ref({
  name: '',
  password: ''
})
const registerInfo = ref({
  name: '',
  password: '',
  confirmPwd: '',
  email: '',
  code: ''
})
const userFormRules = {
  name: [
    { required: true, message: '用户名不能为空', trigger: 'onSubmit' },
    { pattern: /(^[A-Za-z0-9]{1,20}$)/, message: '大小写或数字组成', trigger: 'onSubmit' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'onSubmit' },
    {
      pattern: /^\S*(?=\S{6,20})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*?])\S*$/,
      message: '请输入6-20位密码包含大小写和数字和特殊符号',
      trigger: 'onSubmit'
    }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'onSubmit' },
    {
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: '邮箱格式错误',
      trigger: 'onSubmit'
    }
  ],
  code: [
    { required: true, message: '验证码不能为空', trigger: 'onSubmit' },
    { pattern: /^\d{6}$/, message: '验证码格式错误', trigger: 'onSubmit' }
  ]
}
const loginForm = ref(null)
const registerForm = ref(null)

const goBack = () => {
  history.back()
}
const loginSubmit = async () => {
  const res = await login(loginInfo.value)
  console.log(res)
  if (res.status === 200) {
    userStore.token = res.token
    channelStore.fetchUserChannels()
    showToast({
      message: '登录成功',
      position: 'bottom'
    })
    router.push('/user')
  }
}
const checkUniqueUsername = async (name) => {
  console.log(name)
  errorMessage.value = ''
  if (!name) {
    return
  }
  try {
    await registerForm.value.validate('name')
    await isOnlyName({ username: name })
  } catch (error) {
    if (error.status === 409) {
      errorMessage.value = '用户名已被占用'
    }
  }
}
watch(() => registerInfo.value.name, debounce(checkUniqueUsername, 500))
const onSendCode = async () => {
  try {
    await registerForm.value.validate(['name', 'password', 'confirmPwd', 'email'])
    if (registerInfo.value.password !== registerInfo.value.confirmPwd) {
      showToast({
        message: '密码不一致',
        position: 'bottom'
      })
      return Promise.reject({ message: '密码不一致' })
    }
    await sendCode({ name: registerInfo.value.name, email: registerInfo.value.email })
    showToast({
      message: '验证码已发送至邮箱',
      position: 'bottom'
    })
    isCountDownShow.value = true
  } catch (error) {
    console.log(error)
  }
}
const registerSubmit = async () => {
  const res = await register(registerInfo.value)
  console.log(res)
  if (res.status === 200) {
    showToast({
      message: '注册成功',
      position: 'bottom'
    })
    status.value = '登录'
    loginInfo.value.name = registerInfo.value.name
    loginInfo.value.password = registerInfo.value.password
  }
}
</script>

<template>
  <div class="user-login-container">
    <van-nav-bar :title="status" class="app-nav-bar">
      <template #left>
        <span class="iconfont icon-a-44tubiao-14" @click="goBack"></span>
      </template>
    </van-nav-bar>
    <div v-if="status === '登录'" class="login-form">
      <van-form ref="loginForm" @submit="loginSubmit">
        <van-field
          v-model="loginInfo.name"
          name="name"
          placeholder="请输入用户名"
          :rules="userFormRules.name"
          maxlength="16"
        >
          <template #left-icon>
            <span class="iconfont icon-a-44tubiao-128"></span>
          </template>
        </van-field>
        <van-field
          v-model="loginInfo.password"
          name="password"
          type="password"
          placeholder="请输入密码"
          maxlength="20"
        >
          <template #left-icon>
            <span class="iconfont icon-a-44tubiao-33"></span>
          </template>
        </van-field>
        <div class="submit-btn-wrap">
          <van-button type="info" native-type="submit" block class="submit-btn">登录</van-button>
          <div class="prompt" @click="status = '注册'">没有账户？去注册</div>
        </div>
      </van-form>
    </div>
    <div v-else class="register-form">
      <van-form ref="registerForm" @submit="registerSubmit" @keydown.enter.prevent>
        <van-field
          v-model="registerInfo.name"
          name="name"
          placeholder="请输入用户名"
          :rules="userFormRules.name"
          maxlength="20"
          :error-message="errorMessage"
          center
        >
          <template #left-icon>
            <span class="iconfont icon-a-44tubiao-128"></span>
          </template>
        </van-field>
        <van-field
          v-model="registerInfo.password"
          name="password"
          type="password"
          placeholder="请输入密码"
          :rules="userFormRules.password"
          maxlength="20"
          center
        >
          <template #left-icon>
            <span class="iconfont icon-a-44tubiao-33"></span>
          </template>
        </van-field>
        <van-field
          v-model="registerInfo.confirmPwd"
          name="confirmPwd"
          type="password"
          placeholder="请确认密码"
          :rules="userFormRules.password"
          maxlength="20"
          center
        >
          <template #left-icon>
            <span class="iconfont icon-a-44tubiao-33"></span>
          </template>
        </van-field>

        <van-field
          v-model="registerInfo.email"
          name="email"
          placeholder="请输入邮箱"
          :rules="userFormRules.email"
          maxlength="30"
          center
        >
          <template #left-icon>
            <span class="iconfont icon-a-44tubiao-118"></span>
          </template>
        </van-field>

        <van-field
          v-model="registerInfo.code"
          name="code"
          placeholder="请输入验证码"
          :rules="userFormRules.code"
          type="number"
          maxlength="6"
          size="large"
          center
        >
          <template #left-icon>
            <span class="iconfont icon-a-44tubiao-114"></span>
          </template>
          <template #button>
            <van-count-down
              v-if="isCountDownShow"
              @finish="isCountDownShow = false"
              :time="time"
              format="ss s"
            />

            <van-button v-else @click="onSendCode" class="send-btn" size="mini" round
              >发送验证码</van-button
            >
          </template>
        </van-field>
        <div class="submit-btn-wrap">
          <van-button type="info" native-type="submit" block class="submit-btn">注册</van-button>
          <div class="prompt" @click="status = '登录'">返回登录</div>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.send-btn {
  background-color: #ededed;
  color: #666;
}

.submit-btn-wrap {
  padding: 37px 27px;

  .submit-btn {
    background-color: rgb(197, 66, 34);
    color: #fff;
    border: none !important;
  }
}

.prompt {
  text-align: center;
  color: rgb(84, 84, 84);
}
</style>
