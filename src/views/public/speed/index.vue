<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-button style="margin-bottom: 15px;" type="primary" @click="fetchData">点击测速</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      element-loading-text="Loading"
      fit
      highlight-current-row
      size="mini"
      style="width: 100%"
    >
      <el-table-column
        label="#"
        type="index"
      />
      <el-table-column
        label="节点国家"
        prop="country"
      />
      <el-table-column
        label="描述"
        prop="description"
      />
      <el-table-column
        label="状态"
        width="70px"
      >
        <template slot-scope="scope">
          {{ scope.row.delta }} ms
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  data() {
    return {
      listLoading: false,
      servers: [],
      tableData: []
    };
  },
  created() {
    this.getServerList();
  },
  methods: {
    async getServerInfo(server) {
      try {
        const deltas = [];
        for (let i = 0; i < 3; i++) {
          const date1 = new Date();
          await this.$http.get(server.url);
          const date2 = new Date();
          deltas.push(date2 - date1);
        }
        return {...server, delta: Math.min(...deltas)};
      } catch (e) {
        return {...server, delta: 999};
      }
    },
    async fetchData() {
      this.listLoading = true;
      const tables = [];
      for (const server of this.servers) {
        tables.push(this.getServerInfo(server));
      }
      const that = this;
      Promise.all(tables).then(function(results) {
        that.tableData = results.sort((a, b) => {
          return a.delta - b.delta;
        });
      }).catch(function(err) {
      }).finally(() => {
        this.listLoading = false;
      });
    },
    async getServerList() {
      try {
        const response = await this.$http.get('/public/servers');
        this.servers = response.data;
        this.tableData = response.data;
      } catch (e) {
        this.$message.error('获取服务器列表失败！');
      }
    }
  }
};
</script>
