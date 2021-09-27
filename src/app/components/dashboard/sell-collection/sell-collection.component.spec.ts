import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellCollectionComponent } from './sell-collection.component';

describe('SellCollectionComponent', () => {
  let component: SellCollectionComponent;
  let fixture: ComponentFixture<SellCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
