import { Component, OnInit } from "@angular/core";
import * as CanvasJS from "./canvasjs.min";
import { ChartService } from "../chartservice.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-graph",
  templateUrl: "./graph.component.html",
  styleUrls: ["./graph.component.css"]
})
export class GraphComponent implements OnInit {
  value: Object;

  pidDisplay="";

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.pidDisplay= this.route.snapshot.queryParamMap.get('pid');
    //Chart 1
    var dps = []; // dataPoints
    var chart = new CanvasJS.Chart("chartContainer", {
      title: {
        text: "Traffic Density"
      },
      height: 250,
      axisY: {
        includeZero: false
      },
      data: [
        {
          type: "spline",
          dataPoints: dps
        }
      ]
    });

    var xVal = 0;
    var yVal = 100;
    var updateInterval = 15000;
    var dataLength = 20; // number of dataPoints visible at any point

    var updateChart = function(count) {
      count = count || 1;

      for (var j = 0; j < count; j++) {
        yVal = Math.floor(Math.random() * 100) + 1;
        dps.push({
          x: xVal,
          y: yVal
        });
        xVal++;
      }

      if (dps.length > dataLength) {
        dps.shift();
      }

      chart.render();
    };

    updateChart(dataLength);
    setInterval(function() {
      updateChart(0);
    }, updateInterval);


  //Chart 2
  var dps2 = []; // dataPoints
  var chart2 = new CanvasJS.Chart("chartContainer2", {
    title: {
      text: "Pedestrian Density"
    },
    height: 250,
    axisY: {
      includeZero: false
    },
    data: [
      {
        type: "spline",
        dataPoints: dps2
      }
    ]
  });

  var xVal2 = 0;
  var yVal2 = 100;
  var updateInterval2 = 15000;
  var dataLength2 = 20; // number of dataPoints visible at any point

  var updateChart2 = function(count) {
    count = count || 1;

    for (var j = 0; j < count; j++) {
      yVal2 = Math.floor(Math.random() * 100) + 1;
      dps2.push({
        x: xVal2,
        y: yVal2
      });
      xVal2++;
    }

    if (dps2.length > dataLength2) {
      dps2.shift();
    }

    chart2.render();
  };

  updateChart2(dataLength2);
  setInterval(function() {
    updateChart2(0);
  }, updateInterval2);
}
}
