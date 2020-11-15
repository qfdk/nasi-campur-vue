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
      style="width: 100%"
    >
      <el-table-column
        label="#"
        type="index"
      />
      <el-table-column
        label="节点名称"
        prop="appName"
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
      servers: [
        'http://us.qfdk.me:3001/info',
        'http://sg.qfdk.me:3001/info',
        'http://fr3.qfdk.me:3001/info',
        'http://jp.qfdk.me:3001/info',
        'http://cn2.qfdk.me:3001/info'
      ],
      tableData: []
    }
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const tables = []
      for (const url of this.servers) {
        tables.push(getURL(url))
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
    }
  }
}
</script>
