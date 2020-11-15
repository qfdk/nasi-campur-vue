<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :md="8">
        <el-input v-model="queryInfo.keyword" placeholder="请输入内容" clearable @clear="getUserList()">
          <el-button slot="append" icon="el-icon-search" @click="getUserList()" />
        </el-input>
      </el-col>
      <el-col :md="8">
        <router-link to="/users/create">
          <el-button type="primary" @click="createUser()">添加用户</el-button>
        </router-link>
        <el-button style="margin-left: 5px" class="refresh" type="primary" @click="refresh()">刷新流量</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="users"
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
        prop="wechatName"
        label="微信账号"
      />
      <el-table-column
        prop="nickname"
        label="昵称"
      />
      <el-table-column
        prop="server.country"
        label="国家"
      />
      <el-table-column
        prop="server.location"
        label="城市"
      />
      <el-table-column
        prop="endTime"
        label="结束时间"
      >
        <template slot-scope="scope" value-format="timestamp">
          {{ $dayjs(scope.row.endTime).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        label="流量使用"
      >
        <template slot-scope="scope">
          {{ toTraffic(scope.row.networkRx + scope.row.networkRx) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="containerStatus"
        label="容器状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.containerStatus === 'running'" type="success">正在运行</el-tag>
          <el-tag v-if="scope.row.containerStatus === 'exited'" type="danger">已停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="containerPort"
        label="容器端口"
      />
      <el-table-column
        label="支付"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="userStateChanged(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editUser(scope.row._id)" />
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUser(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="queryInfo.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next"
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
      users: [],
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
    this.getUserList()
  },
  methods: {
    async getUserList() {
      this.listLoading = true
      const { data: res } = await this.$http.get('/api/v2/users',
        {
          params: this.queryInfo
        })
      this.users = res.data
      this.total = res.total
      this.listLoading = false
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList()
    },
    async userStateChanged(userInfo) {
      await this.$http.put(`/api/v2/users/${userInfo._id}/isEnable/${userInfo.isEnable}`)
        .then(response => {
          if (response) {
            const res = response.data
            if (res.meta.status !== 200) {
              userInfo.isEnable = !userInfo.isEnable
              return this.$message.error('修改失败!')
            }
            this.$message.success('更新成功!')
          } else {
            return this.$message.error('修改失败!')
          }
        }).catch(e => {
          this.$message.error(e.toString())
        })
    },
    async deleteUser(userInfo) {
      this.$confirm(`此操作将永久删除该用户 ${userInfo.wechatName}, 是否继续？`, '提示', {
        type: 'warning',
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(async() => {
        await this.$http.delete(`/api/v2/users/${userInfo._id}`)
          .then(async response => {
            const res = response.data
            if (res.meta.status !== 200) {
              return this.$message.error('删除失败!')
            }
            await this.getUserList()
            this.$message.success('删除成功!')
          })
      }).catch(action => {
        this.$message({
          type: 'info',
          message: action === 'cancel'
            ? '放弃删除'
            : '停留在当前页面'
        })
      })
    },
    editUser(id) {
      this.$router.push(`/users/${id}/edit`)
      window.sessionStorage.removeItem('activePath')
    },
    createUser() {
      this.$router.push({ name: 'create-user' })
      window.sessionStorage.setItem('activePath', '/users/create')
    },
    toTraffic(value) {
      if (value < 1000) {
        return value.toFixed(2) + ' MB'
      } else {
        return (value / 1000).toFixed(2) + ' GB'
      }
    },
    async refresh() {
      await this.$http.get(`/api/v2/users/refresh`)
        .then(response => {
          if (response) {
            const res = response.data
            if (res.meta.status === 200) {
              this.$message.success('手动请求刷新流量成功!')
            }
          } else {
            return this.$message.error('刷新流量失败!')
          }
        }).catch(e => {
          this.$message.error(e.toString())
        })
    }
  }
}
</script>
