import { Component, Input, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styleUrls: ['./grafica1.component.css']
})
export class Grafica1Component implements OnInit {

  @Input() titulo: string = 'No titulo';
  @Input('labels') doughnutChartLabels: Label[];
  @Input('Data1') doughnutChartData;
  public colors: Color[] = [
    { backgroundColor: ['#7fd5d5', '#0eb4ff', '#8cff4a'] }
  ];

  constructor() { }

  ngOnInit() {
  }

}
