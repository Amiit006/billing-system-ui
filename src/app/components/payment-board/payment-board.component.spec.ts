import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBoardComponent } from './payment-board.component';

describe('PaymentBoardComponent', () => {
  let component: PaymentBoardComponent;
  let fixture: ComponentFixture<PaymentBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
