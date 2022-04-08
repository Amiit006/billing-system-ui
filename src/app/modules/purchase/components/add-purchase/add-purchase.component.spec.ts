import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseComponent } from './add-purchase.component';

describe('AddPurchaseComponent', () => {
  let component: AddPurchaseComponent;
  let fixture: ComponentFixture<AddPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
