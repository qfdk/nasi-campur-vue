<template>
  <div class="login_container">
    <el-row>
      <el-col :xs="2" :md="9">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :xs="20" :md="6">
        <div class="login_box">
          <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form">
            <h4>超级后台登录</h4>
            <!-- 用户名-->
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>

            <!-- 密码-->
            <el-form-item prop="password">
              <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
            </el-form-item>

            <el-form-item class="btn">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="info" @click="restLoginForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :xs="2" :md="9">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  登录数据绑定
      loginForm: {
        username: 'qfdk',
        password: ''
      }
    }
  },
  methods: {
    restLoginForm() {
      // this.loginForm = {username: 'qfdk'}
      this.$refs.loginFormRef.resetFields();
    },
    async login() {
      try {
        const res = await this.$http.post("/token/login", {
          password: this.loginForm.password
        });
        if (res) {
          this.$message.success("登录成功")
          window.sessionStorage.setItem("accessToken", res.data.accessToken);
          window.sessionStorage.setItem("refreshToken", res.data.refreshToken);
          await this.$router.push("home");
        } else {
          this.$message.error("登录失败")
        }
      } catch (e) {
        this.$message.error(e.toString())
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  background-color: #fff;
  border-radius: 5px;
  margin-top: 150px;
  padding: 10px;
  height: 240px;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  background-color: #f9fafc;
}
</style>