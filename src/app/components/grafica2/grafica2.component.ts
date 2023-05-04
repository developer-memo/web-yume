import { Component, Input, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-grafica2',
  templateUrl: './grafica2.component.html',
  styleUrls: ['./grafica2.component.css']
})
export class Grafica2Component implements OnInit {

  @Input() titulo: string = 'No titulo';
  @Input('dataLine')lineData: string[];
  chart: any;
  year = new Date().getFullYear();
  months: string[] = [];
  values: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.mapDataLine();
    this.createChart();
  }


  mapDataLine = () =>{
    const dataCurrentYear = this.lineData.filter( (lin:any) => lin.fecha_ingre.split('T')[0].slice(0,4) == this.year );

    dataCurrentYear.forEach((ele:any, i) => {
      this.months.push(new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date(ele.fecha_ingre)));
      this.values.push(ele.valor_ingre);
    });
    this.months = this.months.reverse();
    this.values = this.values.reverse();
  }


  createChart = () =>{
    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: this.months,
	       datasets: [
          {
            label: `Ingresos - ${this.year}`,
            data: this.values,
            backgroundColor: 'transparent',
            borderColor: '#0eb4ff',
            pointRadius: 10,
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
    });
  }




}
