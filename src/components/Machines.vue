<template>
  <div class="cards">
    <el-card shadow="hover" :body-style="style" class="card">
      <span>{{ machineInfo.name }}</span>
      <span>{{ machineInfo.number }}</span>
      <span>{{ machineInfo.description }}</span>
      <div class="chart">
        <VueApexCharts
          type="area"
          height="150"
          :options="chartOptions"
          :series="series"
        >
        </VueApexCharts>
      </div>
    </el-card>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import DateTimeService from "@/services/DateTimeService"
import moment from "moment";
export default {
  name: "Machines",
  components: { VueApexCharts },
  props: {
    machineInfo: {
      type: Object,
    },
    batchData: {
      type: Array,
    },
  },

  setup(props) {
    const style = { padding: "5px" };
    const format = "yyyy/MM/dd"
    let data = []
    
    const convertDates = props.batchData.map(x => moment(x.plannedStart, format));
    const recentDate = moment.max(convertDates)
    const machineBatches = props.batchData.filter((x) => {
      if(x.machine === props.machineInfo.name &&
        moment(x.plannedStart, format).diff(recentDate, 'day') == 0)
        return true

      return false
    });

    machineBatches.sort((a, b) => {
      return a.plannedStart.localeCompare(b.plannedStart)
    })

    machineBatches.forEach((x) => {
      data.push({x: new Date(DateTimeService.convert(x.plannedStart)).getTime(), y: 0}, {x: new Date(DateTimeService.convert(x.plannedStop)).getTime(), y: x.amount})
    })

    return {
      series: [
        {
          name: "data",
          data: data
        },
      ],
      chartOptions: {
        chart: {
          type: "area",
          height: "150",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: "datetime",
          title: {
            text: "time",
          },
          labels: {
            datetimeUTC: false,
          },
        },
        yaxis: {
          title: {
            text: "pcs",
          },
        },
         tooltip: {
          x: {
            format: "dd/MM/yy HH:mm:ss",
          },
         }
      },
      style,
    };
  },
};
</script>

<style scoped>
.cards {
  margin: 10px 0;
}

.cards span {
  font-size: 12px;
  margin: 0 10px;
}

.card {
  margin-bottom: 10px;
}
</style>
