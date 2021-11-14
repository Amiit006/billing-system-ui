import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOutstandingComponent } from './client-outstanding.component';

describe('ClientOutstandingComponent', () => {
  let component: ClientOutstandingComponent;
  let fixture: ComponentFixture<ClientOutstandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientOutstandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
