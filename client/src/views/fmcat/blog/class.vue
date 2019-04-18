<template>
  <div class="fmcat-child-container">
    <div class="tag-container color-block vertical">
      <el-row :gutter="20" class="top-line">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addTag">添加分类</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-table :data="blogClassList" style="width: 100%">
            <el-table-column label="ID" width="180">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column label="分类名" width="180">
              <template slot-scope="scope">{{ scope.row.class_name }}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="editTag(scope.$index, scope.row)">编辑</el-button>
                <!-- <el-button size="mini" type="danger" @click="deleteTag(scope.$index, scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blogClassList: null
    }
  },
  async mounted() {
    let {
      data: { blogClassList }
    } = await this.$axios('/fmcat/blog/blogClass')
    this.blogClassList = blogClassList
  },
  methods: {
    editTag(index, row) {
      let that = this
      that
        .$prompt('请输入分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.class_name,
          inputPattern: /^[u4e00-\u9fa5a-zA-Z0-9]{1,12}$/,
          inputErrorMessage: '分类长度2-12字符'
        })
        .then(({ value }) => {
          let add_loading = that.$loading({
            target: '.tag-container'
          })
          that
            .$axios({
              url: '/fmcat/blog/blogClass?id=' + row.id,
              method: 'put',
              data: {
                class_name: value
              }
            })
            .then(r => {
              add_loading.close()
              that.getTagList()
            })
        })
        .catch(() => {
          console.log('取消添加')
        })
    },
    deleteTag(index, row) {
      let that = this
      that
        .$confirm('此操作将永久删除该分类，文章关联将失效, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let add_loading = that.$loading({
            target: '.tag-container'
          })
          that
            .$axios({
              url: '/fmcat/blog/blogClass',
              method: 'delete',
              data: {
                id: row.id
              }
            })
            .then(r => {
              add_loading.close()
              that.getTagList()
            })
        })
        .catch(() => {
          console.log('取消删除')
        })
    },
    addTag() {
      let that = this
      that
        .$prompt('请输入分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[u4e00-\u9fa5a-zA-Z0-9]{1,12}$/,
          inputErrorMessage: '分类长度2-12字符'
        })
        .then(({ value }) => {
          let add_loading = that.$loading({
            target: '.tag-container'
          })
          that
            .$axios({
              url: '/fmcat/blog/blogClass',
              method: 'post',
              data: {
                class_name: value
              }
            })
            .then(r => {
              add_loading.close()
              that.getTagList()
            })
        })
        .catch(() => {
          console.log('取消添加')
        })
    },
    getTagList() {
      let that = this
      let add_loading = that.$loading({
        target: '.tag-container'
      })
      that.$axios('/fmcat/blog/blogClass').then(r => {
        add_loading.close()
        that.blogClassList = r.data.blogClassList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>