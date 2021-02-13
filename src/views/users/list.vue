<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :md="8">
        <el-input v-model="queryInfo.keyword" clearable placeholder="请输入内容" @clear="getUserList()">
          <el-button slot="append" icon="el-icon-search" @click="getUserList()" />
        </el-input>
      </el-col>
      <el-col :md="8">
        <router-link to="/users/create">
          <el-button type="primary" @click="createUser()">添加用户</el-button>
        </router-link>
        <el-button class="refresh" style="margin-left: 5px" type="primary" @click="refresh()">刷新流量</el-button>
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
        label="#"
        type="index"
      />
      <el-table-column
        label="微信账号"
        prop="wechatName"
      >
        <template slot-scope="scope">
          <el-link :href="'/users/findUserByWechatName?wechatName='+scope.row.wechatName" type="primary">
            {{ scope.row.wechatName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="昵称"
        prop="nickname"
      />
      <el-table-column
        label="国家"
        prop="server.country"
      />
      <el-table-column
        label="城市"
        prop="server.location"
      />
      <el-table-column
        label="结束时间"
        prop="endTime"
      >
        <template slot-scope="scope">
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
        label="容器状态"
        prop="containerStatus"
      >
        <template slot-scope="scope">
          <el-dropdown v-if="scope.row.containerStatus === 'running'" trigger="click">
            <span class="el-dropdown-link">
              <el-tag type="success"><i class="el-icon-caret-right" /> 正在运行</el-tag>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-video-pause" @click.native="doAction('stop',scope.row)">
                停止
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-refresh" @click.native="doAction('recreate',scope.row)">
                重建二维码
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown v-if="scope.row.containerStatus === 'exited'" trigger="click">
            <span class="el-dropdown-link">
              <el-tag type="danger"><i class="el-icon-video-pause" /> 已停止</el-tag>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-caret-right" @click.native="doAction('start',scope.row)">
                开始
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </template>
      </el-table-column>
      <el-table-column
        label="容器端口"
        prop="containerPort"
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
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="editUser(scope.row._id)" />
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="deleteUser(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="queryInfo.pageNum"
      :page-size="queryInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { Loading } from 'element-ui'

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
        const instanceLoading = Loading.service(undefined)
        await this.$http.delete(`/api/v2/users/${userInfo._id}`)
          .then(async response => {
            const res = response.data
            if (res.meta.status !== 200) {
              instanceLoading.close()
              return this.$message.error('删除失败!')
            }
            await this.getUserList()
            instanceLoading.close()
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
    async doAction(actionName, user) {
      const instanceLoading = Loading.service(undefined)

      await this.$http.post(`/api/v2/container/${actionName}`,
        {
          ...user
        }).then(async response => {
        const res = response.data
        await this.getUserList()
        instanceLoading.close()
        if (res.meta.status === 200) {
          this.$message.success('操作成功!')
        }
      })
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
