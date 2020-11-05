<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>服务器管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加新服务器</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加新服务器</span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
        <el-form-item label="api 地址" prop="url">
          <el-col :span="8">
            <el-input v-model="ruleForm.url" clearable>
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="节点名称" prop="appName">
          <el-col :span="8">
            <el-input v-model="ruleForm.appName" clearable></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="节点国家" prop="country">
          <el-col :span="8">
            <el-input v-model="ruleForm.country" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="节点位置" prop="location">
          <el-col :span="8">
            <el-input v-model="ruleForm.location" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="节点ip：" prop="ip">
          <el-col :span="8">
            <el-input v-model="ruleForm.ip" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="域名：" prop="domain">
          <el-col :span="8">
            <el-input v-model="ruleForm.domain" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="总控地址：" prop="bigBoss">
          <el-col :span="8">
            <el-input v-model="ruleForm.bigBoss" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注：" prop="description">
          <el-col :span="8">
            <el-input v-model="ruleForm.description" clearable></el-input>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-card>
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
        description: ''
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const {data: res} = await this.$http.post('/api/v2/servers/create', {
            ...this.ruleForm
          });
          if (res.meta.status === 200) {
            await this.$router.push({name: 'servers'});
            window.sessionStorage.setItem("activePath", '/servers');
          } else {
            this.$message.error("添加失败 !");
          }
        } else {
          this.$message.error("验证失败 !")
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async search() {
      await this.$http.get("/api/curl?url=" + this.ruleForm.url + '/info')
          .then((response) => {
            if (response.status === 200 && !response.data.errorMsg) {
              const data = response.data;
              this.ruleForm = {...data}
              this.$message.success("获取信息成功 !");
            } else {
              this.$message.error("获取信息失败 !\n" + response.data.errorMsg);
            }
          });
    }
  }
}
</script>

