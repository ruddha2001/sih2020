import { Component, OnInit } from "@angular/core";
import * as CanvasJS from "./canvasjs.min";
import { ChartService } from "../chartservice.service";
import { ActivatedRoute } from "@angular/router";
import * as $ from "jquery";

@Component({
  selector: "app-graph",
  templateUrl: "./graph.component.html",
  styleUrls: ["./graph.component.css"]
})
export class GraphComponent implements OnInit {
  value: Object;

  temp: Object;

  pidDisplay = "";
  speedLimit : Object;
  weather = "";
  visibility = "";
  roadCondition = "";

  constructor(private route: ActivatedRoute, private data: ChartService) {}

  ngOnInit() {

    this.data.getValue().subscribe(data=>{
      this.speedLimit=data;
    })

    this.pidDisplay=this.route.snapshot.queryParamMap.get('pid');
    this.weather=this.route.snapshot.queryParamMap.get('weather');
    this.roadCondition=this.route.snapshot.queryParamMap.get('roadCondition');
    this.visibility=this.route.snapshot.queryParamMap.get('visibility');

    let dataPoints = [];
    let dpsLength = 0;
    let chart = new CanvasJS.Chart("chartContainer", {
      exportEnabled: true,
      title: {
        text: "Congestion Density"
      },
      height: 500,
      data: [
        {
          type: "spline",
          dataPoints: dataPoints
        }
      ]
    });

    $.getJSON(
      "http://localhost:8080/chartinit",
      function(data) {
        $.each(data, function(key, value) {
          dataPoints.push({ x: value[0], y: parseInt(value[1]) });
        });
        dpsLength = dataPoints.length;
        chart.render();
        updateChart();
      }
    );
    function updateChart() {
      $.getJSON("http://localhost:8080/chartapi", function(data) {
        console.log(data);
        $.each(data, function(key, value) {
          dataPoints.push({
            x: parseInt(value[0]),
            y: parseInt(value[1])
          });
          dpsLength++;
        });

        if (dataPoints.length > 20) {
          dataPoints.shift();
        }
        chart.render();
        setTimeout(function() {
          updateChart();
        }, 15000);
      });
    }
  }
}
