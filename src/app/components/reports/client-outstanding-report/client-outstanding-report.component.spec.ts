import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOutstandingReportComponent } from './client-outstanding-report.component';

describe('ClientOutstandingReportComponent', () => {
  let component: ClientOutstandingReportComponent;
  let fixture: ComponentFixture<ClientOutstandingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientOutstandingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientOutstandingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
