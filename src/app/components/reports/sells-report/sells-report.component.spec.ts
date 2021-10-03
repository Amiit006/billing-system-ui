import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellsReportComponent } from './sells-report.component';

describe('SellsReportComponent', () => {
  let component: SellsReportComponent;
  let fixture: ComponentFixture<SellsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
