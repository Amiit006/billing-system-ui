import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticularsComponent } from './particulars.component';

describe('ParticularsComponent', () => {
  let component: ParticularsComponent;
  let fixture: ComponentFixture<ParticularsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticularsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticularsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
