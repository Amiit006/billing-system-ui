import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSeasonComponent } from './view-season.component';

describe('ViewSeasonComponent', () => {
  let component: ViewSeasonComponent;
  let fixture: ComponentFixture<ViewSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSeasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
