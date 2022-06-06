<template>
  <div class="batches">
    <el-card :body-style="style">
      <el-button type="primary" icon="el-icon-search" circle></el-button>
      <input v-model="search" class="search" placeholder="Filter batches..." />
      <el-tooltip
        class="item"
        effect="dark"
        content="Create batch"
        placement="right"
      >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="batchDialogVisible = true"
          plain
        ></el-button>
      </el-tooltip>
      <el-dialog
        top="2vh"
        title="Create batch"
        v-model="batchDialogVisible"
        @close="onDialogClose"
      >
        <el-form>
          <el-form-item>
            <el-select
              class="form-select"
              v-model="product.value"
              :ref="product.ref"
              placeholder="Select product"
            >
              <el-option
                v-for="item in productList"
                :key="item.itemNumber"
                :value="item.name"
              >
              </el-option>
            </el-select>
            <span class="error" v-if="product.error">{{
              product.error.message
            }}</span>
          </el-form-item>
          <el-form-item>
            <el-select
              class="form-select"
              v-model="machine.value"
              :ref="machine.ref"
              placeholder="Select machine"
            >
              <el-option
                v-for="item in machineList"
                :key="item.number"
                :value="item.name"
              >
              </el-option>
            </el-select>
            <span class="error" v-if="machine.error">{{
              machine.error.message
            }}</span>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item>
                  <el-date-picker
                    class="date-select"
                    popper-class="custom-popper"
                    v-model="start.value"
                    :ref="start.ref"
                    type="datetime"
                    placeholder="Select start date and time"
                    :disabled-date="disabledDate"
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
                  <label v-if="!updateBatch" for="">Batch/PO number*</label>
                  <input
                    :type="batchNumType"
                    v-model="batchNumber.value"
                    :ref="batchNumber.ref"
                  />
                  <span class="error" v-if="batchNumber.error">{{
                    batchNumber.error.message
                  }}</span>

                  <el-form-item v-if="updateBatch">
                    <el-date-picker
                      class="date-select"
                      popper-class="custom-popper"
                      v-model="actualStart"
                      type="datetime"
                      placeholder="Select actual start date and time"
                      :disabled-date="disabledDate"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <label for="">Amount*</label>
                <input
                  type="number"
                  v-model.number="amount.value"
                  :ref="amount.ref"
                />
                <span class="error" v-if="amount.error">{{
                  amount.error.message
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <label for="">Comment</label>
                <input type="text" v-model="comment" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <template>
          <el-dialog width="60%" v-model="previewDialogVisible" append-to-body>
            <VueApexCharts
              ref="chart"
              type="rangeBar"
              height="300"
              :options="chartOptions"
              :series="series"
            />
          </el-dialog>
        </template>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="batchDialogVisible = false">Close</el-button>
            <el-button type="primary" @click="batchForm"
              >Create Batch</el-button
            >
            <el-button
              type="warning"
              v-if="amount.value && start.value && product.value"
              @click="updateChart"
              >Preview</el-button
            >
          </span>
        </template>
      </el-dialog>

      <el-table :data="searchList" :row-class-name="tableClass">
        <el-table-column
          property="state"
          label="State"
          width="100"
        ></el-table-column>
        <el-table-column
          property="batchNumber"
          label="Batch/PO number"
        ></el-table-column>
        <el-table-column
          property="product"
          label="Product name"
        ></el-table-column>
        <el-table-column
          property="plannedStart"
          label="Planned start"
        ></el-table-column>
        <el-table-column
          property="plannedStop"
          label="Planned stop"
        ></el-table-column>
        <el-table-column property="actualStart" label="Actual start">
          <template v-slot="scope">
            {{ batchList[scope.$index].actualStart }}
            <el-button
              v-if="!batchList[scope.$index].actualStart"
              type="success"
              icon="el-icon-video-play"
              size="mini"
              @click="startTime(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column property="actualStop" label="Actual stop">
          <template v-slot="scope">
            {{ batchList[scope.$index].actualStop }}
            <el-button
              v-if="batchList[scope.$index].state === 'Running'"
              type="danger"
              icon="el-icon-video-pause"
              size="mini"
              @click="stopTime(scope.$index)"
            ></el-button> </template
        ></el-table-column>
        
        <el-table-column label="Edit" width="50">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editBatch(scope.$index)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- <el-button type="primary" @click="createBatches">test</el-button> -->
  </div>
</template>

<script>
import { ref, computed, toRefs } from "vue";
import { useForm } from "vue-hooks-form";
import { ElMessageBox } from "element-plus";
import datastoreService from "@/services/DatastoreService";
import DateTimeService from "@/services/DateTimeService";
import moment from "moment";
import VueApexCharts from "vue3-apexcharts";
export default {
  name: "batches",
  props: {
    jobId: {
      type: String,
    },
    jobDate: {
      type: String,
    },
    machineList: {
      type: Array,
    },
    productList: {
      type: Array,
    },
    batchList: {
      type: Array,
    },
    averages: {
      type: Array,
    },
  },
  components: { VueApexCharts },
  setup(props, context) {
    const style = { padding: "10px" };
    const batchDialogVisible = ref(false);
    const updateBatch = ref(false);
    const search = ref("");
    const batchNumType = ref("number");
    const { batchList } = toRefs(props);
    let editIndex;
    const previewDialogVisible = ref(false);

    const searchList = computed(() => {
      return batchList.value.filter((item) => {
        return item.batchNumber.includes(search.value);
      });
    });

    const { useField, handleSubmit } = useForm({
      defaultValues: {},
      validateMode: "submit",
    });

    const product = useField("product", {
      rule: { required: true },
    });
    const batchNumber = useField("batch number", {
      rule: { required: true },
    });
    const amount = useField("amount", {
      rule: { required: true },
    });
    const machine = useField("machine", {
      rule: { required: true },
    });
    const actualStart = ref("");
    const comment = ref("");
    const start = useField("start date", {
      rule: {
        required: true,
        asyncValidator: async (rule, value) =>
          new Promise((resolve, reject) => {
            if (!value) {
              return reject(new Error("start date is required"));
            }
            props.batchList.forEach((e) => {
              const time = "HH:mm:ss";
              const date = "DD/MM/yy";
              const toTime = moment(value.toLocaleString()).format(time);
              const toDate = moment(value.toLocaleString()).format(date);
              const startTime = moment(toTime, time);
              const startDate = moment(toDate, date);
              const t1toTime = moment(e.plannedStart).format(time);
              const t1 = moment(t1toTime, time);
              const t2toTime = moment(e.plannedStop).format(time);
              const t2 = moment(t2toTime, time);
              const t1toDate = moment(e.plannedStart).format(date);
              const d1 = moment(t1toDate, date);
              const t2toDate = moment(e.plannedStop).format(date);
              const d2 = moment(t2toDate, date);

              if (
                startTime.isBetween(t1, t2, null, "[]") &&
                startDate.isBetween(d1, d2, null, "[]") &&
                e.machine === machine.value &&
                batchNumber.value !== e.batchNumber
              ) {
                return reject(
                  new Error(
                    `${e.machine} in use between ${e.plannedStart} and ${e.plannedStop}!`
                  )
                );
              }
            });
            return resolve();
          }),
      },
    });

    function createBatches() {
      props.batchList.forEach((x) => {
        let b = parseInt(x.batchNumber) + 15;
        let batchN = "0" + b.toString();
        let ps = parseInt(x.plannedStart[1]) + 1;
        let pls =
          x.plannedStart[0] +
          ps.toString() +
          x.plannedStart.substring(2, x.plannedStart.length);
        let pst = parseInt(x.plannedStop[1]) + 1;
        let pstop =
          x.plannedStop[0] +
          pst.toString() +
          x.plannedStop.substring(2, x.plannedStop.length);
        let a = parseInt(x.actualStart[1]) + 1;
        let as =
          x.actualStart[0] +
          a.toString() +
          x.actualStart.substring(2, x.actualStart.length);
        let ast = parseInt(x.actualStop[1]) + 1;
        let astop =
          x.actualStop[0] +
          ast.toString() +
          x.actualStop.substring(2, x.actualStop.length);
        const data = {
          state: "",
          product: x.product,
          batchNumber: batchN,
          amount: x.amount,
          machine: x.machine,
          plannedStart: pls,
          plannedStop: pstop,
          actualStart: as,
          actualStop: astop,
          estimatedComplete: "-",
          comment: x.comment,
        };
        console.log(data);
        datastoreService.addBatch("009", batchN, data);
      });
    }

    // const actualStart = useField("actual start", {
    //   rule: {
    //     required: false,
    //     asyncValidator: async (rule, value) =>
    //       new Promise((resolve, reject) => {
    //         if(!value) {
    //           return resolve()
    //         }
    //         props.batchList.forEach((e) => {
    //           const time = "HH:mm:ss";
    //           const date = "DD/MM/yy";
    //           const toTime = moment(value.toLocaleString()).format(time);
    //           const toDate = moment(value.toLocaleString()).format(date);
    //           const startTime = moment(toTime, time);
    //           const startDate = moment(toDate, date);
    //           const t1toTime = moment(e.actualStart).format(time)
    //           const t1 = moment(t1toTime, time)
    //           const t2toTime = moment(e.actualStop).format(time)
    //           const t2 = moment(t2toTime, time)
    //           const t1toDate = moment(e.actualStart).format(date)
    //           const d1 = moment(t1toDate, date)
    //           const t2toDate = moment(e.actualStop).format(date)
    //           const d2 = moment(t2toDate, date)

    //           if (startTime.isBetween(t1, t2, null, '[]') && startDate.isBetween(d1, d2, null, '[]') && e.machine === machine.value && batchNumber.value !== e.batchNumber) {
    //             return reject(new Error( `${e.machine} in use between ${e.actualStart} and ${e.actualStop}!`));
    //           }

    //         });
    //         return resolve();
    //       }),
    //   },
    // });

    function batchForm() {
      const partsPerCycle = props.productList.find(
        (obj) => obj.name === product.value
      ).speed;
      const cycleTime = props.machineList.find(
        (obj) => obj.name === machine.value
      ).speed;

      const avg = props.averages.find(
        (x) => x.product === product.value && x.machine === machine.value
      ).average;
      const calcTime = (amount.value * 60) / avg;
      const avgTime = moment(start.value, "dd/MM/yy HH:mm:ss").add({
        seconds: calcTime,
      });
      const plannedStop = new Date(avgTime)

      // const calculateStop =
      //   Date.parse(start.value) +
      //   (amount.value / partsPerCycle) * cycleTime * 1000;
      // const plannedStop = new Date(calculateStop);
      const calculateActualStop = actualStart.value
        ? Date.parse(actualStart.value) +
          (amount.value / partsPerCycle) * cycleTime * 1000
        : "";
      const actualStop = actualStart.value
        ? new Date(calculateActualStop).toLocaleString()
        : "";
      const actStart = actualStart.value
        ? actualStart.value.toLocaleString()
        : "";

      const data = {
        state: "",
        product: product.value,
        batchNumber: batchNumber.value,
        amount: amount.value,
        machine: machine.value,
        plannedStart: start.value.toLocaleString(),
        plannedStop: plannedStop.toLocaleString(),
        actualStart: actStart,
        actualStop: actualStop,
        estimatedComplete: "-",
        comment: comment.value,
      };
      if (updateBatch.value) {
        context.emit("update-all", editIndex, data);
        datastoreService.updateBatch(props.jobId, batchNumber.value, data);
      } else {
        context.emit("update-batch", data);
        datastoreService.addBatch(props.jobId, batchNumber.value, data);
      }

      batchDialogVisible.value = false;
    }

    function onDialogClose() {
      product.value = "";
      batchNumber.value = "";
      amount.value = "";
      machine.value = "";
      comment.value = "";
      start.value = "";
      actualStart.value = "";
      if (product.error) product.error.message = "";
      if (batchNumber.error) batchNumber.error.message = "";
      if (amount.error) amount.error.message = "";
      if (machine.error) machine.error.message = "";
      if (start.error) start.error.message = "";

      updateBatch.value = false;
      batchNumType.value = "number";
    }

    function editBatch(index) {
      editIndex = index;
      updateBatch.value = true;
      batchNumType.value = "hidden";
      batchDialogVisible.value = true;
      product.value = props.batchList[index].product;
      machine.value = props.batchList[index].machine;
      amount.value = props.batchList[index].amount;
      start.value = new Date(
        DateTimeService.convert(props.batchList[index].plannedStart)
      );
      comment.value = props.batchList[index].comment;
      batchNumber.value = props.batchList[index].batchNumber;
      actualStart.value = props.batchList[index].actualStart
        ? new Date(DateTimeService.convert(props.batchList[index].actualStart))
        : "";
    }

    function disabledDate(date) {
      return (
        date <
          new Date(
            new Date(
              DateTimeService.convert(DateTimeService.removeTime(props.jobDate))
            )
          ) ||
        date >
          new Date(
            new Date(
              DateTimeService.convert(DateTimeService.removeTime(props.jobDate))
            )
          )
      );
    }

    function tableClass({ row }) {
      if (row.actualStop !== "") {
        row.state = "Done";
        return "done-row";
      } else if (
        Date.parse(DateTimeService.convert(row.actualStart)) < Date.now()
      ) {
        row.state = "Running";
        return "running-row";
      }

      row.state = "Pending";
      return "pending-row";
    }

    function startTime(index) {
      const batchNum = props.batchList[index].batchNumber;
      ElMessageBox.confirm(
        `<small><b>Batch/PO number:</b> ${batchNum}</br><b>Actual start:</b> ${new Date().toLocaleString()}</small>`,
        "Are you sure you want to start this batch?",
        {
          confirmButtonText: "Start",
          cancelButtonText: "Cancel",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          context.emit("update-start", index);
          datastoreService.updateBatch(props.jobId, batchNum, {
            actualStart: new Date().toLocaleString(),
          });
        })
        .catch(() => {});
    }

    function stopTime(index) {
      const batchNum = props.batchList[index].batchNumber;
      ElMessageBox.confirm(
        `<small><b>Batch/PO number:</b> ${batchNum}</br><b>Actual stop:</b> ${new Date().toLocaleString()}</small>`,
        "Are you sure you want to stop this batch?",
        {
          confirmButtonText: "Stop",
          cancelButtonText: "Cancel",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          context.emit("update-stop", index);
          datastoreService.updateBatch(props.jobId, batchNum, {
            actualStop: new Date().toLocaleString(),
          });
        })
        .catch(() => {});
    }

    return {
      style,
      search,
      batchDialogVisible,
      product,
      machine,
      batchNumber,
      amount,
      start,
      actualStart,
      comment,
      onDialogClose,
      batchForm: handleSubmit(batchForm),
      disabledDate,
      tableClass,
      startTime,
      stopTime,
      updateBatch,
      editBatch,
      batchNumType,
      searchList,
      createBatches,
      previewDialogVisible,

      // chart
      series: [],
      chartOptions: {
        chart: {
          height: 300,
          type: "rangeBar",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        xaxis: {
          type: "datetime",
          title: {
            text: "Time",
          },
          labels: {
            datetimeUTC: false,
          },
        },
        yaxis: {
          title: {
            text: "Machine",
          },
        },
        title: {
          text: "Time Comparison",
          align: "left",
          offsetX: 14,
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          offsetX: -10,
        },
        tooltip: {
          enabled: true,
          x: {
            show: true,
            format: "dd MMM HH:mm:ss",
          },
        },
      },
    };
  },
  methods: {
    updateChart() {
      let averageTimes = [];
      const avg = this.$props.averages.filter(
        (x) => x.product === this.product.value
      );
      avg.forEach((x) => {
        const calcTime = (this.amount.value * 60) / x.average;
        const avgTime = moment(this.start.value, "dd/MM/yy HH:mm:ss").add({
          seconds: calcTime,
        });
        averageTimes.push({
          name: x.machine,
          data: [
            {
              x: x.machine,
              y: [this.start.value.getTime(), new Date(avgTime).getTime()],
            },
          ],
        });
      });
      this.series = averageTimes;
      window.dispatchEvent(new Event("resize"));
      this.previewDialogVisible = true;
    },
  },
};
</script>

<style scoped>
.batches {
  margin-top: 10px;
}

.el-table {
  font-size: 12px;
}

.form-select {
  width: 98%;
}

.date-select {
  width: 95%;
}
</style>
