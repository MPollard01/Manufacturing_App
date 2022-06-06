<template>
  <div>
    <Navigation />
    <router-view />
  </div>
</template>

<script>

import { ref } from "vue";
import firebase from "firebase";
import Navigation from './components/Navigation.vue';

export default {
  name: "App",
  components: {
    Navigation
  },
  setup() {
    const currentUser = ref(null);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        currentUser.value = user;
      } else {
        currentUser.value = null;
      }
    });

    return { currentUser };
  },
};
</script>

<style>
body {
  font-family: 'Montserrat Light', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #707070;
  background: #f0f0f0e3;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.custom-popper {
  top: 100px !important;
  left: 30px !important;
}



.head {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  margin-top: 60px;
}

.wrap {
  margin: 0 0 30px 60px;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100vh;
}
.wrap::-webkit-scrollbar {
  width: 8px;
}

.wrap::-webkit-scrollbar-track-piece:start {
  background: transparent;
  margin-top: 65px;
}

.wrap::-webkit-scrollbar-track-piece:end {
  background: transparent;
  margin-bottom: 5px;
}

.wrap::-webkit-scrollbar-track {
  display: none;
}

.wrap::-webkit-scrollbar-thumb {
  background-color: rgba(182, 180, 180, 0.568);
  border-radius: 5px;
}

.page {
  display: flex;
  justify-content: center;
  text-align: center;
}

.wrapper {
  width: 50%;
  margin-top: 5rem;
}

.container {
  padding: 20px 10px 0 20px;
  margin-top: 50px;
}

.mg-none {
  margin: 0;
}

.mg-top-4rem {
  margin-top: 4rem;
}

p {
  font-size: 18px;
}

.input-group {
  display: inline-grid;
}

.invert {
  background-color: white;
  color: #c28adb;
  border: 2px solid #c28adb;
}

.link {
  text-decoration: none;
  color: #c28adb;
}

.link:hover {
  text-decoration: underline;
}

.error {
  color: red;
  padding: 0;
  margin: 0;
  opacity: 0.6;
  font-size: 12px;
  line-height: 10px;
  position: absolute;
  top: 60px;
  left: 15%;
}

.title {
  color: #c28adb;
}

.dont-have-account {
  margin-top: 4rem;
}

.bar {
  margin-top: 4rem;
  border-bottom: 2px solid #e8e8e8;
}

#loading {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  display: block;
  opacity: 0.7;
  background-color: #fff;
  z-index: 99;
  text-align: center;
}

#loading-image {
  position: absolute;
  top: 50%;
  z-index: 100;
}

.el-submenu i {
  color: white !important;
}

label {
    position:absolute;
    top: -1px;
    left: 20%;
    background-color: #FFF;
    padding: 0 4px;
    line-height: 20px;
    font-size: 13px;
  }
  input {
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    margin: 10px 0 5px 0;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 70%;
  }

  input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

  input:hover {
    border-color: #bdbdbd;
  }

  input:focus {
    border-color: #53a8ff;
  }
</style>
