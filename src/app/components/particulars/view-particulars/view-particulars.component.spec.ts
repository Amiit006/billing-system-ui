import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewParticularsComponent } from './view-particulars.component';

describe('ViewParticularsComponent', () => {
  let component: ViewParticularsComponent;
  let fixture: ComponentFixture<ViewParticularsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewParticularsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewParticularsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
