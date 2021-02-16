<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="微信名" prop="wechatName">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.wechatName" clearable />
        </el-col>
      </el-form-item>

      <el-form-item label="昵称" prop="nickname" required>
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.nickname" clearable />
        </el-col>
      </el-form-item>

      <el-form-item label="服务区域" prop="region">
        <el-col :md="8" :xs="24">
          <el-select v-model="ruleForm.serverId" placeholder="请选择服务区域" style="width: 100%">
            <el-option
              v-for="server in servers"
              :key="server.id"
              :label="`${(server.location)} (${(server.country)})`"
              :value="server._id"
            >
              {{ server.location }}({{ server.country }})
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>

      <el-form-item label="开始日期" required>
        <el-col :md="8" :xs="24">
          <el-form-item prop="startTime">
            <el-date-picker
              v-model="ruleForm.startTime"
              placeholder="选择日期"
              style="width: 100%;"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="结束日期" required>
        <el-col :md="8" :xs="24">
          <el-form-item prop="endTime">
            <el-date-picker
              v-model="ruleForm.endTime"
              placeholder="选择日期"
              style="width: 100%;"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="付款激活" prop="isEnable">
        <el-switch v-model="ruleForm.isEnable" />
      </el-form-item>

      <el-form-item label="自主控制" prop="enableSelfControl">
        <el-switch v-model="ruleForm.enableSelfControl" />
      </el-form-item>

      <el-form-item label="V2ray" prop="hasV2ray">
        <el-switch v-model="ruleForm.hasV2ray" />
      </el-form-item>

      <el-form-item label="超级图标" prop="icon">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.icon" />
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即更新</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        wechatName: '',
        nickname: '',
        serverId: '',
        oldDomain: '',
        startTime: '',
        endTime: '',
        isEnable: false,
        enableSelfControl: false,
        hasV2ray: false,
        icon: '<span class="label label-primary">iOS</span>'
      },
      servers: [],
      rules: {
        wechatName: [{
          required: true,
          message: '请输微信账号',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 24,
          message: '长度在 3 到 5 个字符',
          trigger: 'blur'
        }
        ],
        nickname: [{
          required: true,
          message: '请输入昵称',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 24,
          message: '长度在 3 到 5 个字符',
          trigger: 'blur'
        }
        ],
        startTime: [{
          type: 'string',
          required: true,
          message: '请选择日期',
          trigger: 'change'
        }],
        endTime: [{
          type: 'string',
          required: true,
          message: '请选择时间',
          trigger: 'change'
        }]
      }
    }
  },
  created() {
    this.getServerList()
    this.getUserByUid(this.$route.params.uid)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          try {
            const {
              data: res
            } = await this.$http.put(`/api/v2/users/${this.$route.params.uid}`, {
              ...this.ruleForm
            })
            if (res.status === 200) {
              await this.$router.push({ name: 'list-user' })
              window.sessionStorage.setItem('activePath', '/users/list')
            } else {
              this.$message.error('修改失败 !')
            }
          } catch (e) {
            this.$message.error(e.toString())
          }
        } else {
          this.$message.error('验证失败 !')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async getServerList() {
      await this.$http.get('/api/v2/servers', {
        params: this.queryInfo
      }).then((response) => {
        if (response) {
          this.servers = response.data.data
        }
      })
    },
    async getUserByUid(uid) {
      const { data: res } = await this.$http.get(`/api/v2/users/${uid}`)
      this.ruleForm = {
        ...res,
        serverId: res.server.nodeId,
        oldDomain: res.server.domain
      }
    }
  }
}
</script>
