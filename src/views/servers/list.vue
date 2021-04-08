<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :md="8">
        <el-input v-model="queryInfo.keyword" clearable placeholder="请输入内容" @clear="getServerList()">
          <el-button slot="append" icon="el-icon-search" @click="getServerList()" />
        </el-input>
      </el-col>
      <el-col :md="8">
        <router-link to="/servers/create">
          <el-button type="primary" @click="createServer()">添加节点</el-button>
        </router-link>
        <el-button class="refresh" style="margin-left: 5px" type="primary" @click="refresh()">刷新节点</el-button>
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
        label="#"
        type="index"
      />
      <el-table-column
        label="排序"
        prop="order"
        width="50"
      />
      <el-table-column
        label="节点名称"
        prop="appName"
        width="250"
      />
      <el-table-column
        label="国家"
        prop="country"
      />
      <el-table-column
        label="城市"
        prop="location"
      />
      <el-table-column
        label="API地址"
        prop="url"
      >
        <template slot-scope="scope">
          <el-link :href="scope.row.url" target="_blank" type="primary">{{ scope.row.url }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="容器数量"
        prop="containersCount"
        width="80"
      />
      <el-table-column
        label="IP"
        prop="ip"
      />
      <el-table-column
        label="公共显示"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isPublic"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeServerStatus(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="editServer(scope.row._id)" />
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="deleteServer(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="queryInfo.pageNum"
      :page-size="queryInfo.pageSize"
      :total="total"
      layout="total, prev, pager, next"
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
    },
    async changeServerStatus(server) {
      await this.$http.put(`/api/v2/servers/${server._id}/isPublic/${server.isPublic}`)
        .then(response => {
          if (response) {
            const res = response.data
            if (res.meta.status !== 200) {
              server.isPublic = !server.isPublic
              return this.$message.error('修改失败!')
            }
            this.$message.success('更新成功!')
          } else {
            return this.$message.error('修改失败!')
          }
        }).catch(e => {
          this.$message.error(e.toString())
        })
    }
  }
}
</script>

