<template>
  <div style="margin-top: 10px;">
    <el-card shadow="hover" :body-style="style" class="card">
      <VueApexCharts
        type="area"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </el-card>
    <el-card shadow="hover" :body-style="style" class="card">
      <VueApexCharts
        type="bar"
        height="350"
        :options="chartOptionsStacked"
        :series="seriesStacked"
      />
    </el-card>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import DateTimeService from "@/services/DateTimeService";
import { onMounted } from "vue";
export default {
  name: "MachineAnalytics",
  props: {
    batchData: {
      type: Array,
    },
  },
  components: { VueApexCharts },

  setup(props) {
    const style = { padding: "5px" };
    let plannedData = [];
    let actualData = [];
    let productData = [];

    props.batchData.forEach((x) => {
      plannedData.push(
        {
          x: new Date(DateTimeService.convert(x.plannedStart)).getTime(),
          y: 0,
        },
        {
          x: new Date(DateTimeService.convert(x.plannedStop)).getTime(),
          y: x.amount,
        }
      );
      if (x.actualStart && x.actualStop) {
        actualData.push(
          {
            x: new Date(DateTimeService.convert(x.actualStart)).getTime(),
            y: 0,
          },
          {
            x: new Date(DateTimeService.convert(x.actualStop)).getTime(),
            y: x.amount,
          }
        );
      }
    });

    onMounted(() => {
      const list = props.batchData;
      const distinctProducts = [...new Set(list.map((x) => x.product))];
      distinctProducts.forEach((x) => {
        productData.push({
          name: x,
          data: list
            .filter((i) => i.product === x)
            .map((y) => [
              new Date(
                DateTimeService.convert(
                  DateTimeService.removeTime(y.plannedStop)
                )
              ),
              y.amount,
            ]),
        });
      });
    });

    return {
      style,
      series: [
        {
          name: "planned",
          data: plannedData,
        },
        {
          name: "actual",
          data: actualData,
        },
      ],
      chartOptions: {
        chart: {
          type: "area",
          height: 350,
          stacked: false,
        },
        colors: ["#008FFB", "#00E396"],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
        },
        xaxis: {
          type: "datetime",
          title: {
            text: "date/time"
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
            text: "Batches Produced Over Time",
            align: "left",
            offsetX: 14,
          },
      },

      seriesStacked: productData,
      chartOptionsStacked: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 600,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            borderRadius: 8,
            horizontal: false,
          },
        },
        xaxis: {
          type: "datetime",
          title: {
            text: "date"
          },
          labels: {
            datetimeUTC: false,
          },
        },
        tooltip: {
          x: {
            format: "dd/MM/yy",
          },
        },
        legend: {
          position: "right",
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
        yaxis: {
          title: {
            text: "quantity",
          },
        },
        title: {
            text: "Daily Total Batches",
            align: "left",
            offsetX: 14,
          },
      },
    };
  },
};
</script>

<style scoped>
.card {
    margin: 10px 0;
}
</style>
