<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :md="8">
        <el-input v-model="queryInfo.keyword" placeholder="请输入内容" clearable @clear="getServerList()">
          <el-button slot="append" icon="el-icon-search" @click="getServerList()" />
        </el-input>
      </el-col>
      <el-col :md="8">
        <router-link to="/servers/create">
          <el-button type="primary" @click="createServer()">添加节点</el-button>
        </router-link>
        <el-button style="margin-left: 5px" class="refresh" type="primary" @click="refresh()">刷新节点</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="servers"
      border
      element-loading-text="Loading"
      fit
      highlight-current-row
      style="margin-top: 15px"
    >
      <el-table-column
        type="index"
        label="#"
      />
      <el-table-column
        prop="appName"
        label="节点名称"
        width="250"
      />
      <el-table-column
        prop="country"
        label="国家"
      />
      <el-table-column
        prop="location"
        label="城市"
      />
      <el-table-column
        prop="url"
        label="API地址"
      >
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.url" target="_blank">{{ scope.row.url }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="containersCount"
        label="容器数量"
        width="80"
      />
      <el-table-column
        prop="ip"
        label="IP"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editServer(scope.row._id)" />
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteServer(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="queryInfo.pageNum"
      :page-size="queryInfo.pageSize"
      layout="total, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
        pageSize: 10
      },
      listLoading: true
    }
  },
  created() {
    this.getServerList()
  },
  methods: {
    async getServerList() {
      this.listLoading = true
      await this.$http.get('/api/v2/servers',
        {
          params: this.queryInfo
        })
        .then(response => {
          if (response) {
            const res = response.data
            this.servers = res.data
            this.total = res.total
            this.listLoading = false
          }
        }).catch((e) => {
          console.log(e)
        })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getServerList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getServerList()
    },
    createServer() {
      this.$router.push({ name: 'create-server' })
      window.localStorage.setItem('activePath', '/servers/create')
    },
    async deleteServer(serverInfo) {
      this.$confirm(`此操作将永久删除该节点 ${serverInfo.appName}, 是否继续？`, '提示', {
        type: 'warning',
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(async() => {
        await this.$http.delete(`/api/v2/servers/${serverInfo._id}`)
          .then(response => {
            const res = response.data
            if (res.meta.status !== 200) {
              return this.$message.error('删除失败!')
            }
            this.$message.success('删除成功!')
          })
        await this.getServerList()
      }).catch(action => {
        this.$message({
          type: 'info',
          message: action === 'cancel'
            ? '放弃删除'
            : '停留在当前页面'
        })
      })
    },
    async editServer(nodeId) {
      await this.$router.push(`/servers/${nodeId}/edit`)
      window.localStorage.removeItem('activePath')
    },
    async refresh() {
      await this.$http.get(`/api/v2/servers/refresh`)
        .then(response => {
          if (response) {
            const res = response.data
            if (res.meta.status === 200) {
              this.$message.success('刷新节点信息成功!')
            }
          } else {
            return this.$message.error('刷新节点信息失败!')
          }
        }).catch(e => {
          this.$message.error(e.toString())
        })
    }
  }
}
</script>

