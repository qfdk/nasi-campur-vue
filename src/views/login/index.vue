<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头部区域 -->
      <div class="avatar_box">
        <img alt src="../../assets/img/icon.png">
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" class="login_form" label-width="0px">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" :type="passwordType" prefix-icon="iconfont icon-3702mima">
            <i slot="suffix" class="iconfont icon-showpassword" @click="showPwd" />
          </el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登陆表单数据对象
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },

    async login() {
      try {
        const res = await this.$http.post('/token/login', {
          password: this.loginForm.password
        })
        if (res) {
          this.$message.success('登录成功')
          window.localStorage.setItem('accessToken', res.data.accessToken)
          window.localStorage.setItem('refreshToken', res.data.refreshToken)
          await this.$router.push('dashboard')
        } else {
          this.$message.error('登录失败')
        }
      } catch (e) {
        this.$message.error(e.toString())
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  //background: url('../../assets/img/bg.png');
  height: 100%;
}

.login_box {
  max-width: 450px;
  width: 100%;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  .icon-showpassword {
    margin-right: 8px;
    cursor:pointer;
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
