<template>
  <div class="fmcat-child-container">
    <el-row :gutter="20" class="top-line">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="color-block top-block">
            <i class="iconfont icon-read"></i>
            已添加 <span class="color-blue">0</span> 个角色
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="color-block top-block mouse-hover" @click="addRole">
            <i class="iconfont icon-add"></i>添加角色
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="color-block vertical">
      <!-- <el-table ref="multipleTable" :data="blogList" tooltip-effect="dark"
        style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
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
            <el-tag size="mini" disable-transitions v-for="item in scope.row.tags_text.split(',')"
              :key="item">{{item}}
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
            <el-button @click="$router.push('/fmcat/blog/detail/'+scope.row.id)"
              type="text" size="small">查看</el-button>
            <el-button @click="blogDelete(scope.row.id,scope.row.class_id)"
              type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    addRole() {
      console.log('哈哈哈，加个鬼')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>