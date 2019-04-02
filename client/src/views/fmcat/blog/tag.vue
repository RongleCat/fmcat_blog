<template>
  <div class="fmcat-child-container">
    <div class="tag-container color-block vertical">
      <el-row :gutter="20" class="top-line">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addTag">添加标签</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-table :data="blogTagList" style="width: 100%">
            <el-table-column label="ID" width="180">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column label="标签名" width="180">
              <template slot-scope="scope">{{ scope.row.tag_name }}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="editTag(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteTag(scope.$index, scope.row)">删除</el-button>
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
      blogTagList:null
    };
  },
  async mounted(){
    let {
      data: { blogTagList }
    } = await this.$axios("/fmcat/blog/blogTag");
    this.blogTagList = blogTagList
  },
  methods: {
    editTag(index, row) {
      let that = this;
      that
        .$prompt("请输入标签", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: row.tag_name,
          inputPattern: /^[u4e00-\u9fa5a-zA-Z0-9]{1,12}$/,
          inputErrorMessage: "标签长度2-12字符"
        })
        .then(({ value }) => {
          let add_loading = that.$loading({
            target: ".tag-container"
          });
          that
            .$axios({
              url: "/fmcat/blog/blogTag?id=" + row.id,
              method: "put",
              data: {
                tag_name: value
              }
            })
            .then(r => {
              add_loading.close();
              that.getTagList();
            });
        })
        .catch(() => {
          console.log("取消添加");
        });
    },
    deleteTag(index, row) {
      let that = this;
      that
        .$confirm("此操作将永久删除该标签，文章关联将失效, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let add_loading = that.$loading({
            target: ".tag-container"
          });
          that
            .$axios({
              url: "/fmcat/blog/blogTag",
              method: "delete",
              data: {
                id: row.id
              }
            })
            .then(r => {
              add_loading.close();
              that.getTagList();
            });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    addTag() {
      let that = this;
      that
        .$prompt("请输入标签", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[u4e00-\u9fa5a-zA-Z0-9]{1,12}$/,
          inputErrorMessage: "标签长度2-12字符"
        })
        .then(({ value }) => {
          let add_loading = that.$loading({
            target: ".tag-container"
          });
          that
            .$axios({
              url: "/fmcat/blog/blogTag",
              method: "post",
              data: {
                tag_name: value
              }
            })
            .then(r => {
              add_loading.close();
              that.getTagList();
            });
        })
        .catch(() => {
          console.log("取消添加");
        });
    },
    getTagList() {
      let that = this;
      let add_loading = that.$loading({
        target: ".tag-container"
      });
      that.$axios("/fmcat/blog/blogTag").then(r => {
        add_loading.close();
        that.blogTagList = r.data.blogTagList;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>