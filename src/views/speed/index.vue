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
const getURL = (URL) => {
  return new Promise(function(resolve, reject) {
    const req = new XMLHttpRequest()
    const date1 = new Date()
    req.open('GET', URL, true)
    req.responseType = 'json'
    req.setRequestHeader('Accept', 'application/json')
    req.onload = function() {
      if (req.status === 200) {
        const date2 = new Date()
        resolve({ ...req.response, delta: date2 - date1 })
      } else {
        reject(new Error(req.statusText))
      }
    }
    req.onerror = function() {
      reject(new Error(req.statusText))
    }
    req.send()
  })
}

export default {
  data() {
    return {
      listLoading: false,
      servers: [],
      tableData: []
    }
  },
  created() {
    this.getServerList()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const tables = []
      for (const server of this.servers) {
        tables.push(getURL(server.url))
      }
      const that = this
      Promise.all(tables).then(function(results) {
        that.tableData = results.sort((a, b) => {
          return a.delta - b.delta
        })
      }).catch(function(err) {
        console.log(err)
      }).finally(() => {
        this.listLoading = false
      })
    },
    async getServerList() {
      try {
        const response = await this.$http.get('/api/servers')
        this.servers = response.data
        this.tableData = response.data
      } catch (e) {
        this.$message.error('获取服务器列表失败！')
      }
    }
  }
}
</script>
