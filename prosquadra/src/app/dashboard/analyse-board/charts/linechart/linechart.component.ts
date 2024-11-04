import { Component } from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartOptions} from 'chart.js';

@Component({
  selector: 'app-linechart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './linechart.component.html',
  styleUrl: './linechart.component.scss'
})
export class LinechartComponent {
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;
}
