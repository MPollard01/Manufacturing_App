<template>
  <div class="graphs">
    <el-card class="graph">
      <VueApexCharts
        type="rangeBar"
        height="300"
        :options="data1.chartOptions"
        :series="data1.series"
      />
    </el-card>
    <el-card class="graph">
      <VueApexCharts
        type="rangeBar"
        height="300"
        :options="data2.chartOptions"
        :series="data2.series"
      />
    </el-card>
  </div>
</template>

<script>
import { onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import DateTimeService from "@/services/DateTimeService";
export default {
  name: "Graphs",
  components: { VueApexCharts },
  props: {
    batchList: {
      type: Array,
    },
  },
  setup(props) {
    const plots1 = [];
    const plots2 = [];
    const machineSeries = [];

    onMounted(() => {
      props.batchList.forEach((el) => {
        plots1.push({
          x: el.batchNumber,
          y: [
            new Date(DateTimeService.convert(el.plannedStart)).getTime(),
            new Date(DateTimeService.convert(el.plannedStop)).getTime(),
          ],
        });
        plots2.push({
          x: el.batchNumber,
          y: [
            new Date(DateTimeService.convert(el.actualStart)).getTime(),
            new Date(DateTimeService.convert(el.actualStop)).getTime(),
          ],
        });
      });

      props.batchList.forEach((i) => {
        machineSeries.push({
          name: i.batchNumber,
          data: [
            {
              x: i.machine,
              y: [
                new Date(DateTimeService.convert(i.plannedStart)).getTime(),
                new Date(DateTimeService.convert(i.plannedStop)).getTime(),
              ],
            },
          ],
        });
      });
    });

    return {
      data1: {
        series: [
          {
            name: "planned",
            data: plots1,
          },
          {
            name: "actual",
            data: plots2,
          },
        ],
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
              text: "Batch no.",
            },
          },
          title: {
            text: "Batch Timeline Planned vs Actual Time",
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
      },
      data2: {
        series: machineSeries,
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
              text: "machine",
            },
          },
          title: {
            text: "Machine Usage Timeline",
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
      },
    };
  },
};
</script>

<style>
.graphs {
  margin-top: 10px;
}

.graph {
  margin-bottom: 10px;
}
</style>
