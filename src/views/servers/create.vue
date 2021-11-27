<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
      <el-form-item label="api 地址" prop="url">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.url" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search" />
          </el-input>
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
      <el-form-item label="SSR 服务" prop="hasSSR">
        <el-col :md="8" :xs="24">
          <el-switch v-model="ruleForm.hasSSR" />
        </el-col>
      </el-form-item>
      <el-form-item label="v2ray服务" prop="hasV2ray">
        <el-col :md="8" :xs="24">
          <el-switch v-model="ruleForm.hasV2ray" />
        </el-col>
      </el-form-item>
      <el-form-item v-if="ruleForm.hasV2ray" label="v2ray域名：" prop="v2rayDomain">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.v2rayDomain" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="公共显示" prop="isPublic">
        <el-col :md="8" :xs="24">
          <el-switch v-model="ruleForm.isPublic" />
        </el-col>
      </el-form-item>
      <el-form-item label="中国服务器" prop="isInChina">
        <el-col :md="8" :xs="24">
          <el-switch v-model="ruleForm.isInChina" />
        </el-col>
      </el-form-item>
      <el-form-item label="备注：" prop="description">
        <el-col :md="8" :xs="24">
          <el-input v-model="ruleForm.description" clearable />
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
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
        hasSSR: true,
        v2rayDomain: '',
        hasV2ray: false,
        isPublic: false,
        isInChina: false
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('/api/v2/servers/create', {
            ...this.ruleForm,
            v2rayDomain: this.ruleForm.hasV2ray ? this.ruleForm.v2rayDomain : ''
          })
          if (res.meta.status === 200) {
            await this.$router.push({ name: 'list-server' })
            window.localStorage.setItem('activePath', '/servers/list')
          } else {
            this.$message.error('添加失败 !')
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
    async search() {
      await this.$http.get('/public/curl?url=' + this.ruleForm.url + '/info').then((response) => {
        if (response.status === 200 && !response.data.errorMsg) {
          const data = response.data
          this.ruleForm = { ...data }
          this.$message.success('获取信息成功 !')
        } else {
          this.$message.error('获取信息失败 !\n' + response.data.errorMsg)
        }
      })
    }
  }
}
</script>
