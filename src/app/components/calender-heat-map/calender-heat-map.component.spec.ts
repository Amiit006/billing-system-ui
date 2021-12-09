import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderHeatMapComponent } from './calender-heat-map.component';

describe('CalenderHeatMapComponent', () => {
  let component: CalenderHeatMapComponent;
  let fixture: ComponentFixture<CalenderHeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderHeatMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderHeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
