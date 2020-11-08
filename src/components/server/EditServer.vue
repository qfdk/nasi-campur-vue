<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节点管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑节点</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>编辑节点</span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
        <el-form-item label="api 地址" prop="url">
          <el-col :span="8">
            <el-input v-model="ruleForm.url" clearable>
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
          <el-button type="primary" @click="submitForm('ruleForm')">立即更新</el-button>
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
        description: '',
        nodeId: ''
      }
    };
  },
  created() {
    this.getServerByUid(this.$route.params.uid);
  },
  methods: {
    async submitForm() {
      try {
        const {
          data: res
        } = await this.$http.put(`/api/v2/servers/${this.$route.params.uid}`, {
          ...this.ruleForm
        });
        if (res.status === 200) {
          await this.$router.push('/servers');
          window.sessionStorage.setItem("activePath", '/servers');
        } else {
          this.$message.error("修改失败 !");
        }
      } catch (e) {
        this.$message.error(e.toString());
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async getServerByUid(uid) {
      const {data: res} = await this.$http.get(`/api/v2/servers/${uid}`);
      this.ruleForm = {
        ...res
      }
    }
  }
}
</script>


