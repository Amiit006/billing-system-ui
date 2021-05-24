import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingBoardComponent } from './billing-board.component';

describe('BillingBoardComponent', () => {
  let component: BillingBoardComponent;
  let fixture: ComponentFixture<BillingBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
