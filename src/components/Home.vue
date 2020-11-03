<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>#nasi-campur-master</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed?'64px':'200px'">
        <el-menu
            text-color="#fff"
            background-color="#3b3e4e"
            :unique-opened="true"
            :collapse="isCollapsed"
            :collapse-transition="false"
            :router="true"
            :default-active="$route.name"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item index="users" :route="{path:'/users'}">
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
            </el-menu-item>
            <el-menu-item index="create-user" :route="{path:'/users/create'}">
              <i class="el-icon-menu"></i>
              <span>添加新用户</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span slot="title">服务器管理</span>
            </template>
            <el-menu-item index="servers" :route="{path:'/servers'}">
              <i class="el-icon-menu"></i>
              <span>服务器列表</span>
            </el-menu-item>
            <el-menu-item index="create-server" :route="{path:'/servers/create'}">
              <i class="el-icon-menu"></i>
              <span>添加新服务器</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item @click="toggleButton">
            <i :class="isCollapsed?'el-icon-s-unfold':'el-icon-s-fold'"></i>
            <span slot="title">{{ isCollapsed ? '展开菜单' : '折叠菜单' }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  data() {
    return {
      isCollapsed: false,
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    toggleButton() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #222222;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
  }
}

.el-menu {
  border: none;
}

.el-aside {
  background-color: #3b3e4e;
  color: #333;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
}

.toggle-button {
  background-color: #3b3e4e;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.5em;
  cursor: pointer;
}

.home-container {
  height: 100%;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>