import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleClientBoardComponent } from './single-client-board.component';

describe('SingleClientBoardComponent', () => {
  let component: SingleClientBoardComponent;
  let fixture: ComponentFixture<SingleClientBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleClientBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleClientBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
