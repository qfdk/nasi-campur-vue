<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :lg="6" :sm="12" :xs="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('users')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon class-name="card-panel-icon" icon-class="peoples" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            用户数量
          </div>
          <count-to :duration="30" :end-val="users" :start-val="0" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :lg="6" :sm="12" :xs="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('servers')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon class-name="card-panel-icon" icon-class="international" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            服务器数量
          </div>
          <count-to :duration="30" :end-val="servers" :start-val="0" class="card-panel-num" />
        </div>
      </div>
    </el-col>

  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      users: 0,
      servers: 0
    }
  },
  created() {
    this.featch()
  },
  methods: {
    featch() {
      this.$http.get('/api/v2/users',
        {}).then(response => {
        if (response) {
          const res = response.data
          this.users = res.total
        }
      }).catch((e) => {
        console.log(e)
      })
      this.$http.get('/api/v2/servers',
        {}).then(response => {
        if (response) {
          const res = response.data
          this.servers = res.total
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    handleSetLineChartData(type) {
      // this.$emit('handleSetLineChartData', type)
      this.$router.push({ name: type.replace(/^\S/, s => s.toUpperCase()) })
      window.sessionStorage.setItem('activePath', '/' + type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
