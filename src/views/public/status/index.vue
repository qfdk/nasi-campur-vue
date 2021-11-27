<template>
  <div>
    <div class="servers">
      <div class="item-box" v-for="server in tableData">
        <div class="server-status">
          <div class="box-col" style="font-size: 18px; font-weight: bold;">
            <span>{{ server.description }}</span><span class="green"><i class="el-icon-success"></i> 在线 </span>
          </div>
        </div>
        <div class="box-col"><label style="width: 50px;">CPU信息</label><span
          title="2核心  Intel(R) Xeon(R) CPU E5-2670 v2 @ 2.50GHz">2核心  Intel(R) Xeon(R) CPU E5-2670 v2 @ 2.50GHz</span>
        </div>
        <div class="box-col"><label style="width: 50px;">在线时长</label><span>62 天 4 小时 44 分 42 秒</span></div>
        <div class="box-col"><label style="width: 50px;">流量使用</label><span>上传 44.650GB | 61.471GB 下载</span></div>
        <div class="box-col"><label style="width: 50px;">实时速率</label><span>上传 1KB/s | 7KB/s 下载</span></div>
        <div class="box-col flex"><label style="width: 50px;">CPU</label>
          <div class="process">
            <div class="process-bar" style="width: 13.2%;"></div>
            <span class="percent">13.20%</span></div>
        </div>
        <div class="box-col flex"><label style="width: 50px;">内存</label>
          <div class="process">
            <div class="process-bar" style="width: 70.37%;"></div>
            <span class="value">696 / 989 MB</span><span class="percent">70.37%</span></div>
        </div>
        <div class="box-col flex"><label style="width: 50px;">虚拟</label>
          <div class="process">
            <div class="process-bar" style="width: 0%;"></div>
            <span class="value">0 / 1023 MB</span><span class="percent">0.00%</span></div>
        </div>
        <div class="box-col flex"><label style="width: 50px;">硬盘</label>
          <div class="process">
            <div class="process-bar" style="width: 38.43%;"></div>
            <span class="value">6.14 / 15.97 GB</span><span class="percent">38.43%</span></div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
const getServerInfo = (server) => {
  return new Promise(function(resolve, reject) {
    const req = new XMLHttpRequest();
    const date1 = new Date();
    req.open('GET', server.url, true);
    req.responseType = 'json';
    req.setRequestHeader('Accept', 'application/json');
    req.onload = function() {
      if (req.status === 200) {
        const date2 = new Date();
        resolve({...server, delta: date2 - date1});
      } else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = function() {
      reject(new Error(req.statusText));
    };
    req.send();
  });
};

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
    async fetchData() {
      this.listLoading = true;
      const tables = [];
      for (const server of this.servers) {
        tables.push(getServerInfo(server));
      }
      const that = this;
      Promise.all(tables).then(function(results) {
        that.tableData = results.sort((a, b) => {
          return a.delta - b.delta;
        });
      }).catch(function(err) {
        console.log(err);
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
<style lang="scss" scoped>
.servers {
  display: grid;
  grid-template-columns:repeat(auto-fill, 350px);
  justify-content: center;
  gap: 10px;

  .item-box {
    width: 350px;
    padding: 5px;
    border: 1px solid forestgreen;
    border-radius: 5px;
    background-color: hsla(0, 0%, 100%, .85);
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin-top: 10px;
    margin-bottom: 10px;

    .green {
      color: #67c23a
    }

    .red {
      color: #f56c6c
    }
  }
}

</style>
