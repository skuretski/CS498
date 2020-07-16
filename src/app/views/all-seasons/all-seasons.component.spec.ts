import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSeasonsComponent } from './all-seasons.component';

describe('AllSeasonsComponent', () => {
  let component: AllSeasonsComponent;
  let fixture: ComponentFixture<AllSeasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSeasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSeasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
