<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户列表</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <router-link to="/users/create">
            <el-button type="primary" @click="createUser()">添加用户</el-button>
          </router-link>
          <el-button class="refresh" type="primary" @click="refresh()">刷新流量</el-button>
        </el-col>
      </el-row>

      <el-table
          :data="users"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            label="#"
        ></el-table-column>
        <el-table-column
            prop="wechatName"
            label="微信账号">
        </el-table-column>
        <el-table-column
            prop="nickname"
            label="昵称">
        </el-table-column>
        <el-table-column
            prop="server.country"
            label="国家">
        </el-table-column>
        <el-table-column
            prop="server.location"
            label="城市">
        </el-table-column>
        <el-table-column
            prop="endTime"
            label="结束时间">
          <template slot-scope="scope">
            {{ $dayjs(scope.row.endTime).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column
            label="流量使用">
          <template slot-scope="scope">
            {{ toTraffic(scope.row.networkRx + scope.row.networkRx) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="containerStatus"
            label="容器状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.containerStatus === 'running'" type="success">正在运行</el-tag>
            <el-tag v-if="scope.row.containerStatus === 'exited'" type="danger">已停止</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="containerPort"
            label="容器端口">
        </el-table-column>
        <el-table-column
            label="支付">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.isEnable"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editUser(scope.row._id)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUser(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
      </el-pagination>

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
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {data: res} = await this.$http.get('/api/v2/users',
          {
            params: this.queryInfo
          })
      this.users = res.data;
      this.total = res.total;

    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getUserList();
    },
    async userStateChanged(userInfo) {
      await this.$http.put(`/api/v2/users/${userInfo._id}/isEnable/${userInfo.isEnable}`)
          .then(response => {
            if (response) {
              const res = response.data
              if (res.meta.status !== 200) {
                userInfo.isEnable = !userInfo.isEnable;
                return this.$message.error("修改失败!");
              }
              this.$message.success("更新成功!");
            } else {
              return this.$message.error("修改失败!");
            }
          }).catch(e => {
            this.$message.error(e.toString());
          });
    },
    async deleteUser(userInfo) {
      await this.$http.delete(`/api/v2/users/${userInfo._id}`)
          .then(response => {
            const res = response.data;
            if (res.meta.status !== 200) {
              return this.$message.error("删除失败!");
            }
            this.$message.success("删除成功!");
          })
      await this.getUserList();
    },
    editUser(id) {
      this.$router.push(`/users/${id}/edit`);
      window.sessionStorage.removeItem("activePath")
    },
    createUser() {
      this.$router.push({name: 'create-user'});
      window.sessionStorage.setItem("activePath", '/users/create');
    },
    toTraffic(value) {
      if (value < 1000) {
        return value.toFixed(2) + ' MB';
      } else {
        return (value / 1000).toFixed(2) + ' GB';
      }
    },
    async refresh() {
      await this.$http.get(`/api/v2/servers/refresh`)
          .then(response => {
            if (response) {
              const res = response.data
              if (res.meta.status === 200) {
                this.$message.success("更新成功!");
              }
            } else {
              return this.$message.error("修改失败!");
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

.refresh {
  margin-left: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>