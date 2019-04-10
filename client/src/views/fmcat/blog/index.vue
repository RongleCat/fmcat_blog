<template>
  <div class="fmcat-child-container">
    <el-row :gutter="20" class="top-line">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="color-block top-block">
            <i class="iconfont icon-read"></i>
            已发布 <span class="color-blue">{{blogCount}}</span> 篇博客
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="color-block top-block mouse-hover" @click="$router.push('/fmcat/blog/add')">
            <i class="iconfont icon-add"></i>添加博客
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="color-block vertical table-container">
      <el-table ref="multipleTable" :data="blogList" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <!-- <el-table-column label="ID" width="50">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column> -->
        <el-table-column label="标题" min-width="500">
          <template slot-scope="scope">
            <el-tag size="mini" disable-transitions type="success" v-if="!!scope.row.is_top"
              @click="cancelTop(scope.row.id)">取消置顶</el-tag>
            <el-tag size="mini" disable-transitions type="info" v-if="!!scope.row.is_disabled"
              @click="cancelDisabled(scope.row.id)">上架</el-tag>
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="分类" width="100">
          <template slot-scope="scope">
            {{ classText(scope.row.class_id) }}
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="300">
          <template slot-scope="scope">
            <el-tag size="mini" disable-transitions v-for="item in scope.row.tags_text.split(',')" :key="item">{{item}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="编辑日期" width="200">
          <template slot-scope="scope">
            {{scope.row.update_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="$router.push('/fmcat/blog/detail/'+scope.row.id)" type="text" size="small">查看</el-button>
            <el-button @click="$router.push('/fmcat/blog/edit/'+scope.row.id)" type="text" size="small">编辑</el-button>
            <el-button @click="blogDelete(scope.row.id,scope.row.class_id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button size="small" :disabled="checkSelectEmpty" @click="setTop" type="success">置顶</el-button>
        <el-button size="small" :disabled="checkSelectEmpty" @click="setDisabled" type="info">下架</el-button>
        <el-button size="small" :disabled="checkSelectEmpty" @click="deleteSelect" type="danger">删除</el-button>
      </div>
      <div class="page-box">
        <el-pagination layout="prev, pager, next" :total="blogCount" :page-size="10" :current-page="currentPage"
          @current-change="pageChange" background>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        multipleSelection: [],
        currentPage: 1,
        blogList:null,
        blogClassList:null,
        blogCount:0
      }
    },
    async mounted(){
      let {
        data: {
          blogList,
          blogCount
        }
      } = await this.$axios('/fmcat/blog/list')
      let {
        data: {
          blogClassList
        }
      } = await this.$axios('/fmcat/blog/blogClass')
      Object.assign(this,{blogList,blogCount,blogClassList})
    },
    computed: {
      checkSelectEmpty() {
        return !this.multipleSelection.length
      }
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      createTag(tagsText) {
        let tags = tagsText.split(',')
        let res = tags.map(item => {
          return `<span>${item}</span>`
        })
        return res.join('')
      },
      classText(classid) {
        let text = '未知'
        let list = this.blogClassList
        this.blogClassList.map(item => {
          if (item.id === classid) {
            text = item.class_name
          }
        })
        return text
      },
      blogDelete(id,classid) {
        let that = this
        this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that
            .$axios({
              url: '/fmcat/blog/delete',
              method: 'delete',
              data: {
                id: [id],
                classid:[classid]
              }
            })
            .then(r => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              that.getTableList(1)
            })
        })
      },
      setTop() {
        let ids = this.multipleSelection.map(item => {
          return item.id
        })
        console.log(ids)
        let that = this
        that.$confirm(`此操作将置顶这${ids.length}篇博客, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that
            .$axios({
              url: '/fmcat/blog/setTop',
              method: 'put',
              data: {
                id: ids,
                value: 1
              }
            })
            .then(r => {
              this.$message({
                type: 'success',
                message: '置顶成功!'
              })
              that.getTableList(1)
            })
        })
      },
      setDisabled() {
        let ids = this.multipleSelection.map(item => {
          return item.id
        })
        console.log(ids)
        let that = this
        that.$confirm(`此操作将下架这${ids.length}篇博客, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that
            .$axios({
              url: '/fmcat/blog/setDisabled',
              method: 'put',
              data: {
                id: ids,
                value: 1
              }
            })
            .then(r => {
              this.$message({
                type: 'success',
                message: '下架成功!'
              })
              that.getTableList(1)
            })
        })
      },
      deleteSelect() {
        let ids = this.multipleSelection.map(item => {
          return item.id
        })
        let classid = this.multipleSelection.map(item => {
          return item.class_id
        })

        let that = this
        this.$confirm(`此操作将永久删除这${ids.length}篇博客, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that
            .$axios({
              url: '/fmcat/blog/delete',
              method: 'delete',
              data: {
                id: ids,
                classid
              }
            })
            .then(r => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              that.getTableList(1)
            })
        })
      },
      cancelTop(id) {
        let that = this
        that.$confirm(`此操作将取消置顶这篇博客, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that
            .$axios({
              url: '/fmcat/blog/setTop',
              method: 'put',
              data: {
                id: [id],
                value: 0
              }
            })
            .then(r => {
              this.$message({
                type: 'success',
                message: '取消置顶成功!'
              })
              that.getTableList(1)
            })
        })
      },
      cancelDisabled(id) {
        let that = this
        that.$confirm(`此操作将上架这篇博客, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that
            .$axios({
              url: '/fmcat/blog/setDisabled',
              method: 'put',
              data: {
                id: [id],
                value: 0
              }
            })
            .then(r => {
              this.$message({
                type: 'success',
                message: '上架成功!'
              })
              that.getTableList(1)
            })
        })
      },
      pageChange(page) {
        this.getTableList(page)
      },
      getTableList(page) {
        let that = this
        this.currentPage = page
        let get_loading = that.$loading({
          target: '.table-container'
        })
        that.$axios({
          url: `/fmcat/blog/list?page=${page}&pagesize=10`
        }).then(r => {
          let {
            data
          } = r
          that.blogCount = data.blogCount
          that.blogList = data.blogList
          get_loading.close()
        })
      }
    }
  }

</script>

<style lang="scss">
  .table-container {
    margin-top: 20px;

    .el-table .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .page-box {
    padding-top: 20px;
  }

  .color-block{
    min-height: auto;
  }

</style>
