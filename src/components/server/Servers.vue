<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节点管理</el-breadcrumb-item>
      <el-breadcrumb-item>节点列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>节点列表</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="getServerList()">
            <el-button slot="append" icon="el-icon-search" @click="getServerList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <router-link to="/servers/create">
            <el-button type="primary" @click="createServer()">添加节点</el-button>
          </router-link>
          <el-button class="refresh" type="primary" @click="refresh()">刷新节点</el-button>
        </el-col>
      </el-row>
      <el-table
          :data="servers"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            label="#"
        ></el-table-column>
        <el-table-column
            prop="appName"
            label="节点名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="country"
            label="国家">
        </el-table-column>
        <el-table-column
            prop="location"
            label="城市">
        </el-table-column>
        <el-table-column
            prop="url"
            label="API地址">
          <template slot-scope="scope">
            <el-link type="primary" :href="scope.row.url" target="_blank">{{ scope.row.url }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
            prop="containersCount"
            label="容器数量">
        </el-table-column>
        <el-table-column
            prop="ip"
            label="IP">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editServer(scope.row._id)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteServer(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-size="queryInfo.pageSize"
          layout="total, prev, pager, next"
          :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      servers: [],
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
              this.servers = res.data;
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
    },
    createServer() {
      this.$router.push({name: 'create-server'});
      window.sessionStorage.setItem("activePath", '/servers/create');
    },
    async deleteServer(serverInfo) {
      this.$confirm(`此操作将永久删除该节点 ${serverInfo.appName}, 是否继续？`, '提示', {
        type: 'warning',
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(async () => {
        await this.$http.delete(`/api/v2/servers/${serverInfo._id}`)
            .then(response => {
              const res = response.data;
              if (res.meta.status !== 200) {
                return this.$message.error("删除失败!");
              }
              this.$message.success("删除成功!");
            })
        await this.getServerList();
      }).catch(action => {
        this.$message({
          type: 'info',
          message: action === 'cancel'
              ? '放弃删除'
              : '停留在当前页面'
        })
      });

    },
    async editServer(nodeId) {
      await this.$router.push(`/servers/${nodeId}/edit`);
      window.sessionStorage.removeItem("activePath")
    },
    async refresh() {
      await this.$http.get(`/api/v2/servers/refresh`)
          .then(response => {
            if (response) {
              const res = response.data
              if (res.meta.status === 200) {
                this.$message.success("刷新节点信息成功!");
              }
            } else {
              return this.$message.error("刷新节点信息失败!");
            }
          }).catch(e => {
            this.$message.error(e.toString());
          });
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

.refresh {
  margin-left: 15px;
}
</style>