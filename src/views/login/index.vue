<template>
  <div class="login-container">
    <div class="avatar_box">
      <img alt src="../../assets/img/icon.png">
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      auto-complete="on"
      class="login-form"
      label-position="left"
    >
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          auto-complete="on"
          name="username"
          placeholder="Username"
          tabindex="1"
          type="text"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          name="password"
          placeholder="Password"
          tabindex="2"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        style="width:100%;margin-bottom:30px;"
        type="primary"
        @click.native.prevent="handleLogin"
      >登录
      </el-button>

    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'qfdk',
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
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
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
        this.$message.error('登录失败')
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
@supports (-webkit-mask: none) and (not (cater-color:#fff)) {
  .login-container .el-input input {
    color: #fff
  }
}

.login-container .el-input {
  display: inline-block;
  height: 47px;
  width: 85%
}

.login-container .el-input input {
  background: transparent;
  border: 0;
  -webkit-appearance: none;
  border-radius: 0;
  padding: 12px 5px 12px 15px;
  color: #fff;
  height: 47px;
  caret-color: #fff;
  -webkit-text-fill-color: #fff
}

.login-container .el-input input:-webkit-autofill {
  -webkit-text-fill-color: #fff !important;
  -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
  background-color: transparent !important;
  background-image: none !important;
  -webkit-transition: background-color 50000s ease-in-out 0s !important;
  transition: background-color 50000s ease-in-out 0s !important
}

.login-container .el-form-item {
  border: 1px solid hsla(0, 0%, 100%, .1);
  background: rgba(0, 0, 0, .1);
  border-radius: 5px;
  color: #454545
}

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background: url('../../assets/img/bg.png');
}

.login-container.mobile {
  background-size: auto 100%
}

.login-container .login-form {
  position: relative;
  width: 420px;
  max-width: 95%;
  padding: 50px 10px 0 10px;
  margin: 220px auto 0;
  overflow: hidden;
  background-color: rgba(0, 0, 0, .6313725490196078);
  border-radius: 10px
}

.login-container .tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px
}

.login-container .tips span:first-of-type {
  margin-right: 16px
}

.login-container .svg-container {
  padding: 6px 5px 6px 15px;
  color: #fff;
  vertical-align: middle;
  width: 30px;
  display: inline-block
}

.login-container .title-container {
  position: relative
}

.login-container .title-container .title {
  font-size: 26px;
  color: rgba(0, 0, 0, .6);
  margin: 0 auto 40px auto;
  text-align: center;
  font-weight: 700
}

.login-container .show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none
}

.login-container .avatar_box {
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
  margin-top: 190px;
  z-index: 1;
}

.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
</style>
