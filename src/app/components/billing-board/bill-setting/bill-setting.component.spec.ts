import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSettingComponent } from './bill-setting.component';

describe('BillSettingComponent', () => {
  let component: BillSettingComponent;
  let fixture: ComponentFixture<BillSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
