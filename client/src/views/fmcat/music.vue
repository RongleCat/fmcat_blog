<template>
  <div class="fmcat-child-container">
    <el-row :gutter="20" class="top-line">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="color-block top-block">
            <i class="iconfont icon-play"></i>
            已添加
            <span class="color-blue">{{musicCount}}</span> 首音乐
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="color-block top-block mouse-hover" @click="addPopup = true">
            <i class="iconfont icon-add"></i>添加音乐
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="music-list">
      <el-col :span="6" v-for="item in musicList" :key="item.id">
        <div class="music-item" :style="{backgroundImage:`url('${item.bg_url}?x-oss-process=image/auto-orient,1/interlace,1/resize,m_fill,w_600,h_400/quality,q_90')`}">
          <div class="tools-layer">
            <span>
              <i class="iconfont icon-like"></i>
              {{item.like}}
            </span>
            <span>
              <i class="iconfont icon-setting" @click="musicEdit(item)"></i>
              <i class="iconfont icon-delete" @click="musicDelete(item.id)"></i>
            </span>
          </div>
          <div class="item-title">{{item.title}} - {{item.music_author}}</div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-pagination layout="prev, pager, next" :total="musicCount" :page-size="12"
        :current-page="currentPage" @current-change="pageChange" background></el-pagination>
    </el-row>
    <el-dialog title="添加音乐" :visible.sync="addPopup" width="700px" ref="music_popup"
      @close="btnCancel">
      <el-form :model="form" v-if="ossPolicy">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="音乐名称" label-width="5em">
              <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片来源" label-width="5em">
              <el-input v-model="form.bg_source" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作者名称" label-width="5em">
              <el-input v-model="form.music_author" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="上传音乐" label-width="5em">
              <el-upload class="upload-demo" :action="ossPolicy.host"
                :http-request="upload" :file-list="musicFileList" :data="{path:'upload_music',suffix:['mp3','wav'],model:'music_url',size:20971520}">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传MP3,WAV文件，且不超过20M</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传图片" label-width="5em">
              <el-upload class="upload-demo" :action="ossPolicy.host"
                :http-request="upload" :file-list="bgFileList" :data="{path:'background',suffix:['jpg','jpeg','png'],model:'bg_url',size:5242880}">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="音乐描述" label-width="5em">
          <el-input type="textarea" autosize v-model="form.describe"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPopup = false">取 消</el-button>
        <el-button type="primary" @click="btnConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let baseForm = '{"title":"","describe":"","bg_url":"","bg_source":"","music_url":"","music_author":""}'
export default {
  data() {
    return {
      addPopup: false,
      form: {
        title: '',
        describe: '',
        bg_url: '',
        bg_source: '',
        music_url: '',
        music_author: ''
      },
      currentPage: 1,
      is_edit: null,
      ossPolicy: null,
      musicList: [],
      musicCount: 0
    }
  },
  async mounted() {
    let {
      data: { ossPolicy }
    } = await this.$axios('/api/getOssToken')
    let {
      data: { musicList, musicCount }
    } = await this.$axios('/fmcat/music')
    Object.assign(this, { ossPolicy, musicList, musicCount })
  },
  computed: {
    musicFileList() {
      let { music_url } = this.form
      if (music_url) {
        let name = music_url.split('/')
        return [{ name: name[name.length - 1], url: music_url }]
      } else {
        return []
      }
    },
    bgFileList() {
      let { bg_url } = this.form
      if (bg_url) {
        let name = bg_url.split('/')
        return [{ name: name[name.length - 1], url: bg_url }]
      } else {
        return []
      }
    }
  },
  methods: {
    upload(e) {
      let { key, suffix: currentSuffix } = this.getFileName(e.file.name)
      let { suffix, size = 10485760, path, model } = e.data
      if (suffix.indexOf(currentSuffix) == -1) {
        this.$notify.error({
          title: '错误',
          message: `本次上传格式只支持 ${suffix.join('，')}，请重新选择文件`
        })
        e.onError()
        return false
      }
      if (e.file.size > size) {
        this.$notify.error({
          title: '错误',
          message: `本次上传文件大小超过限制，请重新选择文件`
        })
        e.onError()
        return false
      }
      let file = e.file
      let formData = new FormData()
      formData.append('key', path + '/' + key)
      formData.append('name', e.filename)
      formData.append('policy', this.ossPolicy.policy)
      formData.append('OSSAccessKeyId', this.ossPolicy.OSSAccessKeyId)
      formData.append('success_action_status', '200')
      formData.append('callback', '')
      formData.append('signature', this.ossPolicy.signature)
      formData.append('file', file)
      this.$axios({
        url: e.action,
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(r => {
          this.form[model] = `http://static.fmcat.top/${path}/${key}`
          e.onSuccess('完成')
        })
        .catch(err => {
          this.$notify.error({
            title: '错误',
            message: '文件上传错误，请稍后重试'
          })
          e.onError(err)
        })
    },
    getFileName(url) {
      let paths = url.split('.')
      let suffix = paths.length > 1 ? paths[paths.length - 1] : 'png'
      return {
        key: `${this.randomRange(36, 36)}.${suffix.toLowerCase()}`,
        // key: url,
        suffix: suffix.toLowerCase()
      }
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
    },
    btnCancel() {
      this.form = JSON.parse(baseForm)
      this.addPopup = false
    },
    btnConfirm() {
      let that = this
      let add_loading = that.$loading({
        target: that.$refs.music_popup.$el.querySelector('.el-dialog')
      })
      let method = 'post'
      let params = ''
      if (that.is_edit) {
        params = `/${that.is_edit}`
        method = 'put'
      }
      that
        .$axios({
          url: '/fmcat/music' + params,
          method,
          data: that.form
        })
        .then(r => {
          let { data } = r
          that.addPopup = false
          add_loading.close()
          that.currentPage = 1
          that.getPageList(1)
          that.is_edit = 0
          that.ossPolicy = data.ossPolicy
        })
    },
    musicDelete(id) {
      let that = this
      this.$confirm('此操作将永久删除该音乐, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that
          .$axios({
            url: '/fmcat/music',
            method: 'delete',
            data: {
              id
            }
          })
          .then(r => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            that.getPageList(1)
          })
      })
    },
    pageChange(page) {
      this.getPageList(page)
    },
    musicEdit(item) {
      let that = this
      that.form = item
      that.is_edit = item.id
      that.addPopup = true
    },
    getPageList(page) {
      let that = this
      this.currentPage = page
      let get_loading = that.$loading({
        target: '.music-list'
      })
      that.$axios({ url: `/fmcat/music?page=${page}&pagesize=12` }).then(r => {
        let { data } = r
        that.musicCount = data.musicCount
        that.musicList = data.musicList
        get_loading.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.music-item {
  height: 22.5vh;
  border-radius: 8px;
  border: 1px solid #d7dfe3;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
  align-items: flex-end;
  .item-title {
    line-height: 40px;
    color: #fff;
    width: 100%;
    padding-left: 10px;
    background: rgba(0, 0, 0, 0.3);
    font-size: 14px;
  }
  .tools-layer {
    display: flex;
    background: rgba(0, 0, 0, 0.2);
    transform: translateY(-100%);
    transition: all 0.2s;
    justify-content: space-between;
    width: 100%;
    span {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 12px;
    }
    i {
      display: block;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #fff;
      cursor: pointer;
      &:not(.icon-like):hover {
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
  &:hover {
    .tools-layer {
      transform: translateY(0);
    }
  }
}
.music-list {
  margin: 10px 0;
  .el-col {
    margin: 10px auto;
  }
}
</style>