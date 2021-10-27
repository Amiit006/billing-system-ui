import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChartTogglerComponent } from './show-chart-toggler.component';

describe('ShowChartTogglerComponent', () => {
  let component: ShowChartTogglerComponent;
  let fixture: ComponentFixture<ShowChartTogglerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowChartTogglerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowChartTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
