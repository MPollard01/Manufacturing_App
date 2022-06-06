<template>
  <div class="wrap">
    <div class="container" v-if="!showJobs">
      <el-card shadow="hover" :body-style="style">
        <el-button type="primary" icon="el-icon-search" circle></el-button>
        <input
          v-model="search"
          class="search"
          placeholder="Type to search..."
        />
        <el-tooltip
          class="item"
          effect="dark"
          content="Create jobs"
          placement="right"
        >
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="jobDialogVisible = true"
            plain
          ></el-button>
        </el-tooltip>
      </el-card>

      <el-dialog
        top="2vh"
        title="Create Job"
        v-model="jobDialogVisible"
        @close="onDialogClose"
      >
        <el-form>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item>
                  <label>Job name*</label>
                  <input
                    v-model="jobName.value"
                    :ref="jobName.ref"
                    type="text"
                  />
                  <span class="error" v-if="jobName.error">{{
                    jobName.error.message
                  }}</span>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item>
                  <el-date-picker
                    popper-class="date"
                    v-model="start.value"
                    :ref="start.ref"
                    type="date"
                    format="DD/MM/YY"
                    placeholder="Select date and time"
                  >
                  </el-date-picker>
                  <span class="error" v-if="start.error">{{
                    start.error.message
                  }}</span>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item>
                  <label for="">Job number*</label>
                  <input
                    type="number"
                    v-model="jobNumber.value"
                    :ref="jobNumber.ref"
                  />
                  <span class="error" v-if="jobNumber.error">{{
                    jobNumber.error.message
                  }}</span>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-form-item>
            <label for="">Job description</label>
            <input type="text" v-model="jobDescription" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="jobDialogVisible = false">Close</el-button>
            <el-button type="primary" @click="jobForm">Create Job</el-button>
          </span>
        </template>
      </el-dialog>
      <div class="table">
        <el-table
          :data="searchList"
          :row-class-name="tableClass"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            property="state"
            label="State"
            width="100"
          ></el-table-column>
          <el-table-column
            property="name"
            label="Job name"
            width="150"
          ></el-table-column>
          <el-table-column
            property="number"
            label="Job number"
          ></el-table-column>
          <el-table-column
            property="description"
            label="Description"
          ></el-table-column>
          <el-table-column
            property="plannedStart"
            label="Start"
            width="200"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <Jobs v-if="showJobs" :jobs="jobList" :jobDefault="currentRow" :averages="averages" @hideJobs="showJobs = false"/>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useForm } from "vue-hooks-form";
import datastoreService from "@/services/DatastoreService";
import DateTimeService from "@/services/DateTimeService";
import Jobs from "@/components/Jobs";
import moment from 'moment'
export default {
  name: "Schedule",
  components: { Jobs },
  setup() {
    const search = ref("");
    const currentRow = ref(null);
    const style = { padding: "10px" };
    const jobDialogVisible = ref(false);
    const jobList = ref([]);
    const showJobs = ref(false)
    const batches = ref([])
    const averages = ref([])

    const searchList = computed(() => {
      return jobList.value.filter(item => {
       return item.name.includes(search.value)
      })
    })

    const { useField, handleSubmit } = useForm({
      defaultValues: {},
      validateMode: "submit",
    });

    const jobName = useField("job name", {
      rule: { required: true },
    });
    const jobNumber = useField("job number", {
      rule: { required: true },
    });
    const jobDescription = ref("");
    
    const start = useField("start date", {
      rule: {
        required: true,
        asyncValidator: async (rule, value) =>
          new Promise((resolve, reject) => {
            if(!value) {
              return reject(new Error("start date is required"))
            }
            jobList.value.forEach((e) => {
              if (value.toLocaleDateString('en-GB') == e.plannedStart) {
                return reject(new Error(`${e.plannedStart} in use`));
              }
            });
            return resolve();
          }),
      },
    });

    function tableClass({ row }) {
      if (Date.now() > new Date(DateTimeService.convert(row.plannedStart))) {
        row.state = "Done";
        return "done-row";
      } else if (
        Date.parse(DateTimeService.convert(row.plannedStart)) === Date.now()
      ) {
        row.state = "Running";
        return "running-row";
      }

      row.state = "Pending";
      return "pending-row";
    }

    onMounted(async () => {
      jobList.value = await datastoreService.fetchData("jobs");
    });

    function onDialogClose() {
      jobName.value = "";
      jobNumber.value = "";
      jobDescription.value = "";
      start.value = "";
      if (jobName.error) jobName.error.message = "";
      if (jobNumber.error) jobNumber.error.message = "";
    }

    function handleCurrentChange(val) {
      currentRow.value = val.name;
      showJobs.value = true
    }

    // form handlers
    const jobForm = () => {
      const data = {
        state: "",
        name: jobName.value,
        number: jobNumber.value,
        description: jobDescription.value,
        plannedStart: start.value.toLocaleDateString('en-GB'),
      };
      datastoreService.addData(data, "jobs", jobNumber.value.toString());
      jobList.value.push(data);
      jobDialogVisible.value = false;
    };

    // working out average time of machines
    /*
      1. get all batches
      2. seperate batches into machines with each product
      3. get the average units made per minute (quantity / duration)
      4. get the average of those averages
      5. get the average time (quantity * 60 / average)
      6. put average times into array i.e. (machine 1, product A, average)
    */

    return {
      search,
      jobDialogVisible,
      style,
      jobName,
      jobNumber,
      jobDescription,
      start,
      jobList,
      currentRow,
      handleCurrentChange,
      onDialogClose,
      jobForm: handleSubmit(jobForm),
      showJobs,
      searchList,
      tableClass,
      batches,
      averages
    };
  },
  async created() {
    this.batches = await datastoreService.fetchAllBatches()
    this.batches.sort((a, b) => {
      return a.machine.localeCompare(b.machine) || a.product.localeCompare(b.product)
    })

    let average = 0
    let n = 0
    const df = "dd/MM/yy HH:mm:ss"
    for(var i=0; i<this.batches.length-1; i++) {
      let duration = moment(this.batches[i].plannedStop, df)
      .diff(moment(this.batches[i].plannedStart, df), "m");
      average = average + (this.batches[i].amount / duration)
      n = n + 1
      if(this.batches[i].product !== this.batches[i+1].product) {
        let avg = average / n
        this.averages.push({machine: this.batches[i].machine, product: this.batches[i].product, average: avg})
        average = 0
        n = 0
      }
      if(i === this.batches.length-2) {
        let duration = moment(this.batches[i+1].plannedStop, df)
        .diff(moment(this.batches[i+1].plannedStart, df), "m");
        average = average + (this.batches[i+1].amount / duration)
        n = n + 1
        let avg = average / n
        this.averages.push({machine: this.batches[i+1].machine, product: this.batches[i+1].product, average: avg})
      }
    }
    console.log(this.averages)
  }
};
</script>

<style>
.search {
  border: none;
  border-bottom: 2px solid #dcdfe6;
  border-radius: 0;
  margin: 0 40px 0 10px;
  width: 80%;
}

input {
  width: 95%;
}

label {
  left: 10px;
}

.error {
  left: 0;
}

.search:focus {
  border-bottom: 2px solid #53a8ff;
}

.el-table .pending-row {
  background: oldlace;
}

.el-table .running-row {
  background: #f0f9eb;
}

.el-table .done-row {
  background: #edf3ff;
}

.table {
  margin-top: 10px;
}

.date {
  top:100px !important;
  left: 800px !important;
}
</style>
