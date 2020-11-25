<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
      <el-form-item label="api 地址" prop="url">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.url" clearable />
        </el-col>
      </el-form-item>

      <el-form-item label="节点名称" prop="appName">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.appName" clearable />
        </el-col>
      </el-form-item>

      <el-form-item label="节点国家" prop="country">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.country" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="节点位置" prop="location">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.location" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="节点ip：" prop="ip">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.ip" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="域名：" prop="domain">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.domain" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="总控地址：" prop="bigBoss">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.bigBoss" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="备注：" prop="description">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.description" clearable />
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
        url: 'http://localhost:3001',
        appName: '',
        country: '',
        location: '',
        ip: '',
        domain: '',
        bigBoss: '',
        description: '',
        nodeId: ''
      }
    }
  },
  created() {
    this.getServerByUid(this.$route.params.uid)
  },
  methods: {
    async submitForm() {
      try {
        const {
          data: res
        } = await this.$http.put(`/api/v2/servers/${this.$route.params.uid}`, {
          ...this.ruleForm
        })
        if (res.status === 200) {
          await this.$router.push({ name: 'list-server' })
          window.sessionStorage.setItem('activePath', '/servers/list')
        } else {
          this.$message.error('修改失败 !')
        }
      } catch (e) {
        this.$message.error(e.toString())
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async getServerByUid(uid) {
      const { data: res } = await this.$http.get(`/api/v2/servers/${uid}`)
      this.ruleForm = {
        ...res
      }
    }
  }
}
</script>
