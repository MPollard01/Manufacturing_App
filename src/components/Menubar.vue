<template>
  <el-menu :default-active="index" mode="horizontal">
    <div id="title">
      <el-button type="info" icon="el-icon-back" @click="goBack"></el-button>
      <el-select>
        <el-option></el-option>
      </el-select>
    </div>
    <el-menu-item index="batches">Batches</el-menu-item>
    <el-menu-item index="routing">Routing</el-menu-item>
    <el-menu-item index="analytics">Analytics</el-menu-item>
    <el-menu-item index="cards">Cards</el-menu-item>
  </el-menu>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "Menubar",
  setup() {
    const index = ref("batches");
    const router = useRouter();

    function goBack() {
      router.replace("/schedule");
    }
    return {
      index,
      goBack,
    };
  },
};
</script>

<style scoped>
#title {
  margin-right: 50px;
  float: left;
  outline: none;
}

#title .el-button {
  height: 60px;
  background-color: rgba(212, 212, 212, 0.918);
  color: black;
  border: none;
  width: 50px;
  margin-right: 10px;
}
</style>
