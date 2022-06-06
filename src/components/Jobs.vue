<template>
  <div class="container">
    <el-menu
      class="menu"
      :default-active="currentIndex"
      mode="horizontal"
      @select="handleSelect"
    >
      <div id="title">
        <el-button type="info" icon="el-icon-back" @click="goBack"></el-button>
        <el-select class="job-select" v-model="currentJob" @change="jobSelect">
          <el-option 
            v-for="job in jobs" 
            :key="job.number" 
            :value="job.name">
          </el-option>
        </el-select>
      </div>
      <el-menu-item index="batches">Batches</el-menu-item>
      <el-menu-item index="routing">Routing</el-menu-item>
      <el-menu-item index="analytics">Analytics</el-menu-item>
    </el-menu>

    <Batches v-if="currentIndex === 'batches'" 
      :jobId="id"
      :jobDate="jobDate" 
      :machineList="machineList" 
      :productList="productList"
      :batchList="batchList"
      :averages="averages"
      @update-batch="updateBatch"
      @update-start="updateStart"
      @update-stop="updateStop"
      @update-all="updateAll"
    />
    <Graphs v-if="currentIndex === 'routing'" :batchList="batchList"/>
    <Analytics v-if="currentIndex === 'analytics'" :batchList="batchList"/>
  </div>
</template>

<script>
import { ref, onMounted, onUpdated, computed } from "vue";
import datastoreService from "@/services/DatastoreService";
import Batches from "@/components/Batches";
import Graphs from "@/components/Graphs";
import Analytics from "@/components/Analytics"
export default {
  name: "Jobs",
  components: { Batches, Graphs, Analytics },
  props: {
    jobs: {
      type: Array,
    },
    jobDefault: {
      type: String
    },
    averages: {
      type: Array
    }
  },
  setup(props, context) {
    const currentIndex = ref("batches");
    const currentJob = ref(props.jobDefault)
    const id = ref(props.jobs.find(o => o.name === currentJob.value).number)
    const jobDate = computed(() => props.jobs.find(o => o.name === currentJob.value).plannedStart)
    const batchList = ref([])
    const productList = ref([])
    const machineList = ref([])

    onMounted(async () => {
      productList.value = await datastoreService.fetchData("products");
      batchList.value = await datastoreService.fetchBatch(id.value);
      machineList.value = await datastoreService.fetchData("machines")
    });

     onUpdated(async () => {
      batchList.value = await datastoreService.fetchBatch(id.value);
    });
    
    function goBack() {
      context.emit("hideJobs");
    }

    function handleSelect(key) {
      currentIndex.value = key;
    }

    function jobSelect(val) {
      id.value = props.jobs.find(o => o.name === val).number
    }

    function updateBatch(data) {
      batchList.value.push(data);
    }

    function updateStart(index) {
      batchList.value[index].actualStart = new Date().toLocaleString()
    }

    function updateStop(index) {
      batchList.value[index].actualStop = new Date().toLocaleString();
    }

    function updateAll(index, data) {
      batchList.value[index] = data
    }

    return {
      currentIndex,
      currentJob,
      goBack,
      handleSelect,
      id,
      jobDate,
      jobSelect,
      batchList,
      productList,
      machineList,
      updateBatch,
      updateStart,
      updateStop,
      updateAll
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

<style>
.job-select .el-input__inner {
  border: none !important;
}
</style>
