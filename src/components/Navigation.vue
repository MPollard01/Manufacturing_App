<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#262d4d"
    text-color="#f7f7f7"
    active-text-color="#fff"
    router
    :default-active="activeIndex"
  >
    <el-menu-item id="title" index="/">
      <span>Manufacturing App</span>
    </el-menu-item>
    <el-menu-item v-if="!loggedIn" index="login">Login</el-menu-item>
    <el-menu-item v-if="!loggedIn" index="register">Register</el-menu-item>
    <el-submenu v-if="loggedIn" index="options">
      <template v-if="user" #title>{{ user.email }}</template>
      <el-menu-item @click="logout" index="Logout">Logout</el-menu-item>
    </el-submenu>
  </el-menu>

  <el-menu
    v-if="loggedIn"
    background-color="#262d4d"
    text-color="#f7f7f7"
    active-text-color="#e6fffe"
    :default-active="activeIndex"
    class="el-menu-vertical-demo"
    :collapse="isCollapsed"
    router
  >
    <el-menu-item index="lines">
      <i class="el-icon-set-up el-icon"></i>
      <template #title>Lines</template>
    </el-menu-item>
    <el-menu-item index="schedule">
      <i class="el-icon-s-order el-icon"></i>
      <template #title>Schedule</template>
    </el-menu-item>
  </el-menu>
  <el-drawer title="I am the title" v-model="helpMenu" :with-header="false">
    <div class="help">
      <span v-html="helpMessage"></span>
    </div>
  </el-drawer>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import firebase from "firebase";

export default {
  name: "Navigation",
  setup() {
    const activeIndex = ref("");
    const loggedIn = ref(false);
    const user = ref(null);
    const isCollapsed = ref(true);
    const helpMenu = ref(false);
    const helpMessage = ref("");

    const router = useRouter();

    function logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          firebase.auth().onAuthStateChanged(() => {
            user.value = null;
            loggedIn.value = false;
            router.push("/login");
          });
        });
    }

    return {
      activeIndex,
      loggedIn,
      user,
      logout,
      isCollapsed,
      helpMenu,
      helpMessage,
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
      }
    });
  },
  watch: {
    $route() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.loggedIn = true;
          this.user = user;
        }
      });
      //console.log(to, from);
      this.activeIndex = this.$router.currentRoute._value.name;
    },
  },
};
</script>

<style scoped>
.el-submenu__title i {
  color: #fff !important;
}

#title {
  font-size: medium;
  margin-right: calc(100vw - 36rem);
}
#title:hover {
  background: none !important;
}

#search-bg {
  background: none !important;
}
#search {
  border-radius: 15px;
  height: 30px;
}

.el-menu-vertical-demo {
  position: fixed;
  height: 100%;
  border: none;
  top: 60px;
  z-index: 1;
}

.el-icon {
  color: #fff;
}

.el-menu-demo {
  position: fixed;
  width: 100%;
  z-index: 1;
}

.el-menu {
  z-index: 999;
}

.help {
  margin: 10px auto;
  padding: 15px;
}

.not-active {
  color: white !important;
  border: none !important;
}
</style>