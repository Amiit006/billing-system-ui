import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParticularComponent } from './add-particular.component';

describe('AddParticularComponent', () => {
  let component: AddParticularComponent;
  let fixture: ComponentFixture<AddParticularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddParticularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParticularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
