import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondSeasonComponent } from './second-season.component';

describe('SecondSeasonComponent', () => {
  let component: SecondSeasonComponent;
  let fixture: ComponentFixture<SecondSeasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondSeasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
