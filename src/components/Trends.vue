<template>
  <div style="margin-top: 10px;">
    <el-card shadow="hover" :body-style="style" class="card">
      <VueApexCharts
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </el-card>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import DateTimeService from "@/services/DateTimeService";
export default {
  name: "Trends",
  props: {
    batchData: {
      type: Array,
    },
  },
  components: { VueApexCharts },

  setup(props) {
    const style = { padding: "5px" };
    let data = [];

    props.batchData.forEach((x) => {
      data.push({
        name: x.batchNumber,
        data: [
          { x: new Date(DateTimeService.convert(x.plannedStop)).getTime(), y: x.amount },
        ],
      });
    });

    return {
      style,
      series: data,
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
            show: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          type: "datetime",
          title: {
            text: "date/time",
          },
          labels: {
            datetimeUTC: false,
          },
          tooltip: {
            x: {
              format: "dd/MM/yy HH:mm:ss",
            },
          },
        },
        yaxis: {
          title: {
            text: "quantity",
          },
        },
        title: {
            text: "Individual Batch Quantities",
            align: "left",
            offsetX: 14,
          },
      },
    };
  },
};
</script>

<style></style>
