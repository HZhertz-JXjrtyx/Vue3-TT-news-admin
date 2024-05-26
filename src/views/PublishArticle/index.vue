<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
// 使用quill富文本编辑器
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { usePublishStore } from '@/stores'
import { base64ToFile } from '@/utils'
import PublishSetting from '@/components/publish/PublishSetting.vue'

const router = useRouter()
const publishStore = usePublishStore()

// 富文本编辑器容器
const editor = ref(null)
// 富文本编辑器配置
const options = {
  debug: 'info',
  modules: {
    toolbar: '#toolbar',
  },
  placeholder: '请输入正文',
  theme: 'snow',
}

let quill
onMounted(() => {
  quill = new Quill(editor.value, options)
  // 自定义图片按钮的行为
  let toolbar = quill.getModule('toolbar')
  toolbar.addHandler('image', () => {
    let fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.setAttribute('accept', 'image/*')
    fileInput.click()

    fileInput.addEventListener('change', () => {
      let file = fileInput.files[0]

      let reader = new FileReader()
      // 读取文件
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        // reader.result 包含了一个可以在浏览器中显示的图片 URL
        let imageDataUrl = reader.result
        // 在 Quill 编辑器中插入图片
        let range = quill.getSelection()
        quill.insertEmbed(range.index, 'image', imageDataUrl)
        // 将图片的 dataUrl 和对应的 File 对象保存到 Map 中
        // imageFileList.value.push({ imageDataUrl, file })
        // 在图片后面设置光标
        quill.setSelection(range.index + 1)
      }
    })
  })

  // Quill 提供了一个名为 quill.on 的 API，它允许你监听编辑器的各种事件。
  // 其中，'text-change' 事件在任何文本变化时都会被触发，包括插入、删除和格式更改。
  // 这个事件的回调函数接收两个参数：delta 和 oldDelta。delta 是描述这次变化的 Delta 对象，oldDelta 是变化前的完整文档内容。
  // 可以检查 delta 对象，看看这次变化是否涉及到图片。
  // 如果 delta 对象中包含了 insert 操作，并且插入的内容是一个图片，那么就说明用户添加了一张图片。
  // 同理，如果 delta 对象中包含了 delete 操作，并且删除的内容是一个图片，那么就说明用户删除了一张图片。
  quill.on('text-change', (delta, oldDelta) => {
    delta.ops.forEach((op) => {
      if (op.insert && op.insert.image) {
        // 用户添加了一张图片
        let imageDataUrl = op.insert.image
        console.log('Image added')
        const file = base64ToFile(imageDataUrl, 'quill_image')
        console.log(file)

        publishStore.articleImageFileList.push({ imageDataUrl, file })
      } else if (op.delete) {
        // 用户可能删除了一张图片，我们需要检查一下
        let index = oldDelta.ops.findIndex((oldOp) => oldOp.insert && oldOp.insert.image)
        if (index !== -1) {
          let dataUrl = oldDelta.ops[index].insert.image
          console.log('Image deleted')
          // 如果图片已经被删除，从 imageFileList 中移除它
          publishStore.articleImageFileList = publishStore.articleImageFileList.filter((item) => {
            item.imageDataUrl !== dataUrl
          })
        }
      }
    })
  })
})

// 文章标题
// const articleTitle = ref('')
// 标题验证
const validator = () => {
  publishStore.title = publishStore.title.trim()
  return /.{2,}/.test(publishStore.title)
}
const titleFormRef = ref(null)
// 文章内容
// const quillContent = ref('')
// provide('quillContent', quillContent)

const showPopup = ref(false)

const handleNext = async () => {
  await titleFormRef.value.validate('title')
  // 正文验证
  const editorContent = quill.root.textContent.trim()
  console.log(editorContent)
  if (!editorContent) {
    showToast('请输入文章内容')
    return
  }

  //   // 更新富文本编辑器的内容
  //   quill.root.innerHTML = updatedContent
  // }
  // console.log(quill.root.innerHTML)
  publishStore.quillContent = quill.root.innerHTML
  // console.log('publishStore.quillContent', publishStore.quillContent)
  showPopup.value = true
}
</script>
<template>
  <div class="header">
    <span class="back" @click="router.back()">取消</span>
    <span class="go" @click="handleNext">下一步</span>
  </div>
  <van-form ref="titleFormRef">
    <van-field
      v-model="publishStore.title"
      rows="1"
      autosize
      type="textarea"
      placeholder="请输入标题(2-30字)"
      maxlength="30"
      name="title"
      :rules="[{ validator, message: '请输入2-30字标题' }]"
    />
  </van-form>

  <div ref="editor"></div>
  <div id="toolbar">
    <!-- 字体大小 -->
    <select class="ql-size">
      <option value="small">小</option>
      <option selected>标准</option>
      <option value="large">大</option>
      <option value="huge">超大</option>
    </select>
    <!-- 标题 -->
    <select class="ql-header">
      <option value="1">标题1</option>
      <option value="2">标题2</option>
    </select>
    <!-- 颜色 -->
    <select class="ql-color">
      <option value="red">红色</option>
      <option value="green">绿色</option>
      <option value="blue">蓝色</option>
      <option value="orange">橙色</option>
      <option value="violet">紫色</option>
      <option value="#d0d1d2">灰色</option>
    </select>
    <!-- 背景色 -->
    <select class="ql-background">
      <option value="yellow">黄色</option>
      <option value="lightgreen">浅绿色</option>
      <option value="lightblue">浅蓝色</option>
    </select>
    <!-- 粗体、斜体、下划线、删除线 -->
    <button class="ql-bold">粗体</button>
    <button class="ql-italic">斜体</button>
    <button class="ql-underline">下划线</button>
    <button class="ql-strike">删除线</button>
    <!-- 缩进 -->
    <button class="ql-indent" value="-1">减少缩进</button>
    <button class="ql-indent" value="+1">增加缩进</button>
    <!-- 链接、图片 -->
    <button class="ql-link">链接</button>
    <button class="ql-image">图片</button>
    <!-- 列表 -->
    <button class="ql-list" value="ordered">有序列表</button>
    <button class="ql-list" value="bullet">无序列表</button>
    <!-- 对齐方式 -->
    <button class="ql-align" value=""></button>
    <button class="ql-align" value="center"></button>
    <button class="ql-align" value="right"></button>
    <button class="ql-align" value="justify"></button>
    <!-- 清除格式 -->
    <button class="ql-clean">清除格式</button>
  </div>

  <!-- 右侧弹出 -->
  <van-popup
    v-model:show="showPopup"
    closeable
    close-icon-position="top-left"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <PublishSetting publishType="article" />
  </van-popup>
</template>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin: 30px;
  .go {
    color: var(--main-color-red-1);
  }
}
:deep(textarea) {
  font-size: 40px;
  font-weight: 600;
}

.ql-container {
  border: none;
  height: 1016px;
  overflow: auto;
}
#toolbar {
  position: absolute;
  bottom: 0;
}
:first(:deep(.van-toast)) {
  bottom: 30px;
}
</style>
