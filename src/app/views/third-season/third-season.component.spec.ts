import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdSeasonComponent } from './third-season.component';

describe('ThirdSeasonComponent', () => {
  let component: ThirdSeasonComponent;
  let fixture: ComponentFixture<ThirdSeasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdSeasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
