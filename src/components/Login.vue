<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form">
        <h4>超级后台登录</h4>
        <!-- 用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="icofont-user"></el-input>
        </el-form-item>

        <!-- 密码-->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="icofont-lock"></el-input>
        </el-form-item>

        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>

      </el-form>
    </div>

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
        console.log(e)
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
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    //border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
      background-color: #eeeeee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>