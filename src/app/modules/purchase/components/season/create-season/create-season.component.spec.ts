import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSeasonComponent } from './create-season.component';

describe('CreateSeasonComponent', () => {
  let component: CreateSeasonComponent;
  let fixture: ComponentFixture<CreateSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSeasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
