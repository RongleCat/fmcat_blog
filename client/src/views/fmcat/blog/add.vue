<template>
  <div class="fmcat-child-container">
    <div ref="blog_add" class="color-block vertical">
      <el-row :gutter="20" class="top-line">
        <el-col :span="9">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入标题" v-model="blogTitle">
              <template slot="prepend">标题</template>
            </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <el-popover placement="top" trigger="hover">
              <img v-if="coverUrl" :src="coverUrl" class="cover-img">
              <span class="tip-text" v-else>未添加封面</span>
              <el-button icon="el-icon-plus" class="btn-addcover" @click="openCoverSelect"
                slot="reference">{{coverUrl?'已添加':'添加封面'}}</el-button>
            </el-popover>
            <input type="file" style="display:none" ref="up_cover" @change="selectDone">
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-select v-model="blogClass" placeholder="选择博客类别">
              <el-option v-for="item in blogClassList" :key="item.id" :label="item.class_name"
                :value="item.id"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-select v-model="tagSeleted" multiple placeholder="请选择文章标签"
              @change="change">
              <el-option v-for="item in blogTagList" :key="item.id" :label="item.tag_name"
                :value="item.id"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <mavon-editor codeStyle="atom-one-dark" :toolbars="toolbars" @imgAdd="editorUpload"
        @save="submit" @change="editContent" ref="md" :boxShadow="false">
        <template v-slot:left-toolbar-after><button type="button" aria-hidden="true"
            title="插入视频" @click="insertVideo" class="op-icon fa iconfont icon-play"></button>
        </template>
      </mavon-editor>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blogTitle: '',
      blogClass: '',
      blogMarkdown: '',
      blogHtml: '',
      saveing: false,
      tagSeleted: [],
      tagsText: '',
      coverUrl: null,
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: false, // 标题
        underline: false, // 下划线
        strikethrough: false, // 中划线
        mark: false, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: false, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: false, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: false, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      blogTagList: null,
      blogClassList: null
    }
  },
  async mounted() {
    let that = this
    let {
      data: { blogTagList }
    } = await that.$axios('/fmcat/blog/blogTag')
    let {
      data: { blogClassList }
    } = await that.$axios('/fmcat/blog/blogClass')
    // that.blogTagList = blogTagList
    // that.blogClassList = blogClassList
    Object.assign(that, { blogTagList, blogClassList })
    //绑定全局快捷键保存提交事件
    window.addEventListener('keydown', function(e) {
      if (e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
        if (that.saveing) {
          return false
        } else {
          that.$refs.md.save()
        }
      }
    })
  },
  methods: {
    change(value) {
      let res = []
      for (let i = 0; i < this.blogTagList.length; i++) {
        let item = this.blogTagList[i]
        if (value.indexOf(item.id) != -1) {
          res.push(item.tag_name)
        }
      }
      this.tagsText = res.join(',')
    },
    async editorUpload(pos, $file) {
      console.log($file)
      let that = this
      let $vm = this.$refs.md
      let add_loading = that.$loading({
        target: $vm.$el
      })
      try {
        let url = await this.imageUpload($file, 'blog_images/')
        $vm.$img2Url(pos, url)
        add_loading.close()
      } catch (error) {
        add_loading.close()
        console.log(error)
      }
    },
    async imageUpload($file, path) {
      let that = this
      let filename = path + that.randomRange(36) + /\.[^\.]+/.exec($file.name)[0]
      let formData = new FormData()
      let {
        data: { ossPolicy }
      } = await that.$axios('/api/getOssToken')
      formData.append('key', filename)
      formData.append('name', filename)
      formData.append('policy', ossPolicy.policy)
      formData.append('OSSAccessKeyId', ossPolicy.OSSAccessKeyId)
      formData.append('success_action_status', '200')
      formData.append('callback', '')
      formData.append('signature', ossPolicy.signature)
      formData.append('file', $file)
      return new Promise((resolve, reject) => {
        this.$axios({
          url: ossPolicy.host,
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(r => {
            resolve(`//static.fmcat.top/${filename}`)
          })
          .catch(err => {
            this.$notify.error({
              title: '错误',
              message: '文件上传错误，请稍后重试'
            })
            reject(err)
          })
      })
    },
    editContent(markdown, html) {
      this.blogMarkdown = markdown
      this.blogHtml = html
    },
    submit(markdown, html) {
      let that = this
      let post = {
        markdown: that.blogMarkdown,
        html: that.blogHtml,
        title: that.blogTitle,
        class_id: that.blogClass,
        tags_id: that.tagSeleted.join(','),
        tags_text: that.tagsText
      }
      if (that.coverUrl) {
        post.cover = that.coverUrl
      }
      if (!post.title) {
        that.$message.error('标题必须写，写多少心里没数么')
        return false
      }
      if (!post.class_id) {
        that.$message.error('类别选一下咯')
        return false
      }
      if (!post.tags_text.length && !post.tags_id.length) {
        that.$message.error('标签选一下咯')
        return false
      }
      if (!post.markdown) {
        that.$message.error('内容还没编辑，发布啥呢')
        return false
      }
      that.saveing = true
      that
        .$confirm('此操作将发布博客, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        })
        .then(() => {
          let add_loading = that.$loading()
          setTimeout(() => {
            that
              .$axios({
                url: '/fmcat/blog/add',
                method: 'post',
                data: post
              })
              .then(r => {
                console.log(r)
                add_loading.close()
                that.$router.replace('/fmcat/blog')
                that.$message({
                  type: 'success',
                  message: '发布成功!'
                })
                that.saveing = false
              })
          }, 2000)
        })
        .catch(() => {
          console.log('取消发布')
          that.saveing = false
        })
    },
    openCoverSelect() {
      this.$refs.up_cover.dispatchEvent(new MouseEvent('click'))
    },
    async selectDone(e) {
      let cover_loading = this.$loading({
        target: '.color-block'
      })
      let url = await this.imageUpload(e.target.files[0], 'blog_cover/')
      cover_loading.close()
      this.coverUrl = url
    },
    insertVideo() {
      let $vm = this.$refs.md
      let insert_text = {
        prefix: `<iframe width="860" height="480" frameborder="0" src="`,
        subfix: '" allowFullScreen="true"></iframe>',
        str: ''
      }
      this.$prompt('请输入视频页面链接', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '视频链接不能为空'
      })
        .then(({ value }) => {
          let iframeReg = /<iframe.*?(?:>|\/>)/gi
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
          let arr = value.match(iframeReg)
          let src = arr[0].match(srcReg)
          insert_text.str = src[1]
          $vm.insertText($vm.getTextareaDom(), insert_text)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    randomRange(min, max, charStr) {
      let returnStr = '',
        range
      if (typeof max == 'string') {
        charStr = max
      }
      range = max && typeof max == 'number' ? Math.round(Math.random() * (max - min)) + min : min
      charStr = charStr || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < range; i++) {
        let index = Math.round(Math.random() * (charStr.length - 1))
        returnStr += charStr.substring(index, index + 1)
      }
      return returnStr
    }
  }
}
</script>

<style lang="scss" scoped>
.el-col {
  margin-bottom: 20px;
}

.grid-content {
  .el-select {
    width: 100%;
  }
}

.color-block {
  height: 100%;
}
.markdown-body {
  flex: 1;
}
.btn-addcover {
  width: 100%;
  padding: 12px 10px;
}
.tip-text {
  text-align: center;
  display: block;
}
.cover-img {
  display: block;
  max-width: 400px;
}
</style>
