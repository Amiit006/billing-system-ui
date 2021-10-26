import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticularsReportComponent } from './particulars-report.component';

describe('ParticularsReportComponent', () => {
  let component: ParticularsReportComponent;
  let fixture: ComponentFixture<ParticularsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticularsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticularsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
