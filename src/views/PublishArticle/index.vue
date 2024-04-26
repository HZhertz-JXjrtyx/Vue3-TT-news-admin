<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { uploadArticleImgApi } from '@/api'

const router = useRouter()

const editor = ref(null)
const options = {
  debug: 'info',
  modules: {
    toolbar: '#toolbar',
  },
  placeholder: '请输入正文',
  theme: 'snow',
}
let quill
const imageMap = ref(new Map())
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
      reader.onloadend = () => {
        // reader.result 包含了一个可以在浏览器中显示的图片 URL
        let imageUrl = reader.result
        // 在 Quill 编辑器中插入图片
        let range = quill.getSelection()
        quill.insertEmbed(range.index, 'image', imageUrl)
        // 将图片的 dataUrl 和对应的 File 对象保存到 Map 中
        imageMap.value.set(imageUrl, file)
      }
      if (file) {
        // 如果用户选择了文件，开始读取文件
        reader.readAsDataURL(file)
      }
    })
  })

  quill.on('text-change', (delta, oldDelta) => {
    delta.ops.forEach((op) => {
      if (op.insert && op.insert.image) {
        // 用户添加了一张图片
        let imageUrl = op.insert.image
        console.log('Image added:', imageUrl)
      } else if (op.delete) {
        // 用户可能删除了一张图片，我们需要检查一下
        let index = oldDelta.ops.findIndex((oldOp) => oldOp.insert && oldOp.insert.image)
        if (index !== -1) {
          let imageUrl = oldDelta.ops[index].insert.image
          console.log('Image deleted:', imageUrl)
          // 如果图片已经被删除，从 Map 中移除它
          imageMap.value.delete(imageUrl)
        }
      }
    })
  })
})

const title = ref('')

const handleNext = async () => {
  console.log(imageMap.value)
  console.log(quill.root.innerHTML)
  // 创建一个 FormData 对象
  let formData = new FormData()
  formData.append('folder', 'article_images')
  // 将所有图片添加到 FormData 对象中
  imageMap.value.forEach((file) => {
    console.log(file)
    formData.append('article_img', file)
  })
  const res = await uploadArticleImgApi(formData)
  if (res.status === 200) {
    console.log(res.fileMapObj)
    console.log(imageMap.value.values().next().value)
    // 获取服务器返回的映射（新 URL 对应原始名称）
    const newUrlMap = res.fileMapObj

    // 获取编辑器中的所有内容
    let contents = quill.getContents()

    // 遍历所有的操作
    contents.ops.forEach((op, index) => {
      if (op.insert && op.insert.image) {
        // 这是一个图片
        let oldUrl = op.insert.image
        // 在 newUrlMap 中找到对应的新 URL
        console.log(imageMap.value.get(oldUrl).name)
        let newUrl = newUrlMap[imageMap.value.get(oldUrl).name]
        if (newUrl) {
          // 如果找到了新 URL，使用它替换旧 URL
          quill.updateContents({
            ops: [{ retain: index }, { delete: 1 }, { insert: { image: newUrl } }],
          })
        }
      }
    })
  }
  console.log(quill.root.innerHTML)
}
</script>
<template>
  <div class="header">
    <span class="back" @click="router.back()">取消</span>
    <span class="go" @click="handleNext">下一步</span>
  </div>
  <van-field
    v-model="title"
    rows="1"
    autosize
    type="textarea"
    placeholder="请输入标题(2-30字)"
    maxlength="30"
  />
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
:deep(#van-field-1-input) {
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
</style>
