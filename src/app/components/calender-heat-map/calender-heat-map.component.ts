import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ChartResponse } from 'src/app/model/chart-response.model';


const monthName = new Intl.DateTimeFormat("en-GB", { month: "short" });
const weekdayName = new Intl.DateTimeFormat("en-GB", { weekday: "short" });

@Component({
  selector: 'app-calender-heat-map',
  templateUrl: './calender-heat-map.component.html',
  styleUrls: ['./calender-heat-map.component.css']
})
export class CalenderHeatMapComponent implements OnInit {

  name = 'Angular';
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  legendPosition = 'right';
  showXAxisLabel = true;
  tooltipDisabled = false;
  showText = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'GDP Per Capita';
  showGridLines = true;
  innerPadding = '10%';
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;
  showSeriesOnHover = true;
  roundEdges: boolean = true;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel = false;
  noBarWhenZero = true;
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  rotateXAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;
  colorSets: any;
  colorScheme = {
    domain: ['#bdbdbd','#368ce7', '#2e7ed3', '#2061a7']
  };
  schemeType: string = 'ordinal';
  selectedColorScheme: string;

  // heatmap
  heatmapMin: number = 0;
  heatmapMax: number = 500000;
  calendarData: any[] = [];


  @Input() serviceData: Observable<ChartResponse[]>;

  constructor() {
    // this.calendarData = this.getCalendarData();
  }

  ngOnInit(): void {
    this.serviceData.subscribe(x=> {
      this.calendarData = this.getCalendarData(x);
    });
  }

  calendarAxisTickFormatting(mondayString: string) {
    const monday = new Date(mondayString);
    const month = monday.getMonth();
    const day = monday.getDate();
    const year = monday.getFullYear();
    const lastSunday = new Date(year, month, day - 1);
    const nextSunday = new Date(year, month, day + 6);
    return lastSunday.getMonth() !== nextSunday.getMonth() ? monthName.format(nextSunday) : '';
  }

  calendarTooltipText(c): string {
    return `
      <span class="tooltip-label">${c.label} • ${c.cell.date.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      }).replace(/ /g, '-')}</span>
      <span class="tooltip-val">${c.data.toLocaleString()}</span>
    `;
  }

  getCalendarData(chartResponse: ChartResponse[]): any[] {
    // today
    const now = new Date();
    const todaysDay = now.getDate();
    const thisDay = new Date(now.getFullYear(), now.getMonth(), todaysDay);

    this.heatmapMax = Math.max.apply(Math, chartResponse.map(function(o) { return o.value; }))

    // Monday
    const thisMonday = new Date(thisDay.getFullYear(), thisDay.getMonth(), todaysDay - thisDay.getDay() + 1);
    const thisMondayDay = thisMonday.getDate();
    const thisMondayYear = thisMonday.getFullYear();
    const thisMondayMonth = thisMonday.getMonth();

    // 52 weeks before monday
    const calendarData = [];
    const getDate = d => new Date(thisMondayYear, thisMondayMonth, d);
    for (let week = -52; week <= 0; week++) {
      const mondayDay = thisMondayDay + week * 7;
      const monday = getDate(mondayDay);

      // one week
      const series = [];
      for (let dayOfWeek = 7; dayOfWeek > 0; dayOfWeek--) {
        const date = getDate(mondayDay - 1 + dayOfWeek);
        const data = chartResponse.find(data => moment(date, 'yyyy-MM-dd').isSame(data.name));

        // skip future dates
        if (date > now) {
          continue;
        }

        // value
        const value = data ? data.value : 0;
        series.push({
          date,
          name: weekdayName.format(date),
          value
        });
      }

      calendarData.push({
        name: monday.toString(),
        series
      });
    }
    return calendarData;
  }

}
