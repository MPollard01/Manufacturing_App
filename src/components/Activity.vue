<template>
  <div style="margin-top: 10px;">
    <el-card shadow="hover" :body-style="style" class="card">
      <VueApexCharts
        type="line"
        height="230"
        :options="chartOptions"
        :series="series"
      >
      </VueApexCharts>
      <VueApexCharts
        type="area"
        height="130"
        :options="chartOptionsLine"
        :series="seriesLine"
      >
      </VueApexCharts>
    </el-card>

    <el-card shadow="hover" :body-style="style" class="card">
        <el-button type="primary" icon="el-icon-search" size="medium" circle></el-button>
        <input
          v-model="search"
          class="search"
          placeholder="Type to search..."
        />
    <el-table :data="searchList">
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
      <el-table-column
        property="actualStart"
        label="Actual start"
      ></el-table-column>
      <el-table-column
        property="actualStop"
        label="Actual stop"
      ></el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import moment from "moment";
import DateTimeService from "@/services/DateTimeService";
import { ref, computed} from "vue";
export default {
  name: "Activity",
  components: { VueApexCharts },
  props: {
    batchData: {
      type: Array,
    },
    machine: {
      type: Object,
    },
  },
  setup(props) {
    const style = { padding: "5px" };
    const format = "dd/MM/yy HH:mm:ss";
    const search = ref("")
    const dates = props.batchData.map((x) =>
      moment(x.plannedStart, format)
    );
    const minDate = moment.min(dates);
    const maxDate = moment.max(dates);
    const data = ref([])

    const searchList = computed(() => {
      return props.batchData.filter(item => {
       return item.batchNumber.includes(search.value)
      })
    })

    props.batchData.forEach((x) => {
      data.value.push(
        {
          x: new Date(DateTimeService.convert(x.plannedStart)).getTime(),
          y: 0,
        },
        {
          x: new Date(DateTimeService.convert(x.plannedStop)).getTime(),
          y: x.amount,
        }
      );
    });

    return {
      searchList,
      search,
      series: [
        {
          data: data.value,
        },
      ],
      chartOptions: {
        chart: {
          id: "chart2",
          type: "line",
          height: 230,
          toolbar: {
            autoSelected: "pan",
            show: true,
          },
        },
        colors: ["#546E7A"],
        stroke: {
          width: 3,
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: 1,
        },
        markers: {
          size: 0,
        },
        xaxis: {
          type: "datetime",
          labels: {
            datetimeUTC: false,
          },
          tooltip: {
            x: {
              format: "dd/MM/yy HH:mm:ss",
            },
          },
        },
      },

      seriesLine: [
        {
          data: data.value,
        },
      ],
      chartOptionsLine: {
        chart: {
          id: "chart1",
          height: 130,
          type: "area",
          brush: {
            target: "chart2",
            enabled: true,
          },
          selection: {
            enabled: true,
            xaxis: {
              min: new Date(DateTimeService.convert(minDate._i)).getTime(),
              max: new Date(DateTimeService.convert(maxDate._i)).getTime(),
            },
          },
        },
        colors: ["#008FFB"],
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.91,
            opacityTo: 0.1,
          },
        },
        xaxis: {
          type: "datetime",
          labels: {
            datetimeUTC: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          tickAmount: 2,
        },
      },

      style,
    };
  },
};
</script>

<style scoped>
.el-table {
  margin-top: 10px;
  font-size: 12px;
}
.card {
    margin: 10px 0;
}
</style>
