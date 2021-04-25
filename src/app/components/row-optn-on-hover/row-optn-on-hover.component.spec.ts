import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowOptnOnHoverComponent } from './row-optn-on-hover.component';

describe('RowOptnOnHoverComponent', () => {
  let component: RowOptnOnHoverComponent;
  let fixture: ComponentFixture<RowOptnOnHoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowOptnOnHoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowOptnOnHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
