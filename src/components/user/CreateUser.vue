<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加新用户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加新用户</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="微信名" prop="wechatName">
          <el-col :span="8">
            <el-input v-model="ruleForm.wechatName" clearable></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname" required>
          <el-col :span="8">
            <el-input v-model="ruleForm.nickname" clearable></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="服务区域" prop="region">
          <el-col :span="8">
            <el-select v-model="ruleForm.serverId" placeholder="请选择服务区域" style="width: 100%">
              <el-option v-for="server in servers" :key="server.id"
                         :label="`${(server.location)} (${(server.country)})`"
                         :value="server._id">
                {{ server.location }}({{ server.country }})
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="开始日期" required>
          <el-col :span="8">
            <el-form-item prop="startTime">
              <el-date-picker
                  type="date" placeholder="选择日期"
                  v-model="ruleForm.startTime"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="结束日期" required>
          <el-col :span="8">
            <el-form-item prop="endTime">
              <el-date-picker type="date" placeholder="选择日期"
                              v-model="ruleForm.endTime"
                              value-format="yyyy-MM-dd"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="付款激活" prop="isEnable">
          <el-switch v-model="ruleForm.isEnable"></el-switch>
        </el-form-item>

        <el-form-item label="自主控制" prop="enableSelfControl">
          <el-switch v-model="ruleForm.enableSelfControl"></el-switch>
        </el-form-item>

        <el-form-item label="超级图标" prop="icon">
          <el-col :span="8">
            <el-input v-model="ruleForm.icon"></el-input>
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
        wechatName: '',
        nickname: '',
        serverId: '',
        startTime: '',
        endTime: '',
        isEnable: false,
        enableSelfControl: false,
        icon: '<span class="label label-primary">iOS</span>'
      },
      servers: [],
      rules: {
        wechatName: [
          {required: true, message: '请输微信账号', trigger: 'blur'},
          {min: 1, max: 24, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
          {min: 1, max: 24, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        startTime: [
          {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
        ],
        endTime: [
          {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
        ]
      }
    };
  },
  created() {
    this.getServerList();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const {data: res} = await this.$http.post('/api/v2/users/create', {
            ...this.ruleForm
          });
          if (res.status === 200) {
            await this.$router.push({name: 'users'});
            window.sessionStorage.setItem("activePath", '/users');
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
    async getServerList() {
      await this.$http.get('/api/v2/servers',
          {
            params: this.queryInfo
          }).then((response) => {
        if (response) {
          this.servers = response.data;
        }
      });
    }
  }
}
</script>

