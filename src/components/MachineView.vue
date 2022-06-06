<template>
  <div class="machine">
    <el-menu
      class="menu"
      :default-active="currentIndex"
      mode="horizontal"
      @select="handleSelect"
    >
      <div id="title">
        <el-button type="info" icon="el-icon-back" @click="goBack"></el-button>
        <el-select class="job-select" v-model="currentMachine">
          <el-option v-for="m in machineList" :key="m.number" :value="m.name">
          </el-option>
        </el-select>
      </div>
      <el-menu-item index="activity">Activity</el-menu-item>
      <el-menu-item index="trends">Trends</el-menu-item>
      <el-menu-item index="analytics">Analytics</el-menu-item>
    </el-menu>

    <Activity v-if="currentIndex === 'activity'" :batchData="machineBatches" :machine="machine" />
    <Trends v-if="currentIndex === 'trends'" :batchData="machineBatches" />
    <MachineAnalytics v-if="currentIndex === 'analytics'" :batchData="machineBatches" />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import Activity from "./Activity"
import Trends from "./Trends"
import MachineAnalytics from "./MachineAnalytics"
export default {
  name: "MachineView",
  components: {Activity, Trends, MachineAnalytics},
  props: {
    machine: {
      type: Object,
    },
    machineList: {
      type: Array,
    },
    batchData: {
      type: Array
    }
  },

  setup(props, context) {
    const currentMachine = ref(props.machine.name);
    const currentIndex = ref("activity");
    const machineBatches = computed(() => {
     return props.batchData.filter((x) => x.machine === currentMachine.value)
    })

    machineBatches.value.sort((a, b) => {
      return a.plannedStart.localeCompare(b.plannedStart)
    })

    function goBack() {
      context.emit("hide");
    }

    function handleSelect(key) {
      currentIndex.value = key;
    }

    return {
      currentMachine,
      currentIndex,
      goBack,
      handleSelect,
      machineBatches
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
  height: 61px;
  background-color: rgba(212, 212, 212, 0.918);
  color: black;
  border: none;
  width: 50px;
  margin-right: 10px;
}

#title .el-button:hover {
  background-color: rgb(199, 199, 199);
}

.menu {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
}
</style>
