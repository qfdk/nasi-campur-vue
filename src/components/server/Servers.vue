<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>服务器管理</el-breadcrumb-item>
      <el-breadcrumb-item>服务器列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>服务器列表</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="getServerList()">
            <el-button slot="append" icon="el-icon-search" @click="getServerList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加服务器</el-button>
        </el-col>
      </el-row>

    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      total: 0,
      queryInfo: {
        keyword: '',
        pageNum: 1,
        pageSize: 10,
      }
    }
  },
  created() {
    this.getServerList()
  },
  methods: {
    async getServerList() {
      await this.$http.get('/api/v2/servers',
          {
            params: this.queryInfo
          })
          .then(response => {
            if (response) {
              const res = response.data;
              this.users = res.data;
              this.total = res.total;
            }
          }).catch((e) => {
            console.log(e)
          })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getServerList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getServerList();
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>