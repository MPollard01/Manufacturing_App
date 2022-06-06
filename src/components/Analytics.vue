<template>
  <div class="graphs">
    <el-card class="graph">
      <VueApexCharts
        type="area"
        height="300"
        :options="chartOptions"
        :series="series"
      />
    </el-card>
    <el-row>
      <el-col :span="12">
        <el-card class="graph" style="margin-right: 10px">
          <VueApexCharts
            type="radialBar"
            height="250"
            :options="radial.chartOptions"
            :series="radial.series"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="graph">
          <VueApexCharts
            type="radialBar"
            height="250"
            :options="radial2.chartOptions"
            :series="radial2.series"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import moment from "moment";
export default {
  name: "Analitics",
  components: { VueApexCharts },
  props: {
    batchList: {
      type: Array,
    },
  },
  setup(props) {
    const series = [];
    const radial = [];
    const machineRadial = [];
    const radialLabels = [];
    const format = "dd/MM/yy HH:mm:ss";
    let dates = [];
    let minStart = moment();
    let maxEnd = moment("01/01/2000 00:00:00", format);

    const plotGraph = () => {
      props.batchList.forEach((b) => {
        const start = moment(b.plannedStart, format);
        const end = moment(b.plannedStop, format);
        const duration = end.diff(start, "m");
        const unitsPerMin = b.amount / duration;

        dates.push([start.valueOf(), (unitsPerMin * 0).toFixed(2)]);
        for (var i = 1; i <= duration; i++) {
          dates.push([
            start.add(1, "m").valueOf(),
            (unitsPerMin * i).toFixed(2),
          ]);
        }

        series.push({
          name: b.batchNumber,
          data: dates,
        });
        dates = [];
      });
    };

    const overallUnusedTime = () => {
      let unusedTime = 0;
      for (var i = 0; i < props.batchList.length - 1; i++) {
        const nextStart = moment(props.batchList[i + 1].plannedStart, format);
        const start = moment(props.batchList[i].plannedStart, format);
        const end = moment(props.batchList[i].plannedStop, format);
        if (end > maxEnd) maxEnd = end;
        if (start < minStart) minStart = start;
        if (nextStart > maxEnd)
          unusedTime = unusedTime + nextStart.diff(maxEnd);
      }
      const totalDuration = maxEnd.diff(minStart);
      radial.push(Math.round((unusedTime / totalDuration) * 100));
    };

    const unusedMachineTime = () => {
      const list = props.batchList;
      const sortbyMachine = list.sort((a, b) => {
        return a.machine.localeCompare(b.machine);
      });
      let currentMachine = sortbyMachine[0].machine;
      let unusedTime = 0;
      const totalDuration = maxEnd.diff(minStart);
      radialLabels.push(currentMachine);
      for (var i = 0; i < sortbyMachine.length; i++) {
        const start = moment(sortbyMachine[i].plannedStart, format);
        const end = moment(sortbyMachine[i].plannedStop, format);
        if (currentMachine === sortbyMachine[i].machine) {
          unusedTime = unusedTime + end.diff(start);
        } else {
          currentMachine = sortbyMachine[i].machine;
          radialLabels.push(currentMachine);
          machineRadial.push(
            Math.round(((totalDuration - unusedTime) / totalDuration) * 100)
          );
          unusedTime = 0;
          unusedTime = unusedTime + end.diff(start);
        }
      }
      machineRadial.push(
        Math.round(((totalDuration - unusedTime) / totalDuration) * 100)
      );
    };

    onMounted(() => {
      plotGraph();
      overallUnusedTime();
      unusedMachineTime();
    });

    return {
      series: series,
      chartOptions: {
        chart: {
          height: 300,
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          type: "datetime",
          title: {
            text: "date/time"
          },
          labels: {
            datetimeUTC: false,
          },
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm:ss",
          },
        },
        title: {
            text: "Average Batch Performance Per Minute",
            align: "center",
            offsetX: 14,
          },
          yaxis: {
            title: {
              text: "quantity"
            }
          }
      },
      radial: {
        series: radial,
        chartOptions: {
          chart: {
            height: 250,
            type: "radialBar",
          },
          title: {
            text: "overall unused time",
            align: "center",
            offsetX: 14,
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "70%",
              },
            },
          },
          labels: ["Unused Time"],
        },
        
      },
      radial2: {
        series: machineRadial,
        chartOptions: {
          chart: {
            height: 250,
            type: "radialBar",
          },
          title: {
            text: "machines unused time",
            align: "center",
            offsetX: 14,
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
              total: {
                show: true,
                label: "Total",
                formatter: function(val) {
                  let total = 0
                  for(var i of val.config.series) {
                    total = total + i
                  }
                  return total + '%'
                }
              },
              }
            },
          },
          labels: radialLabels,
        },
      },
    };
  },
};
</script>

<style></style>
