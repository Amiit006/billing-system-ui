import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBuyerComponent } from './top-buyer.component';

describe('TopBuyerComponent', () => {
  let component: TopBuyerComponent;
  let fixture: ComponentFixture<TopBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopBuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
