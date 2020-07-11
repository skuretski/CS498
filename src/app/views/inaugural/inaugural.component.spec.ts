import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InauguralComponent } from './inaugural.component';

describe('InauguralComponent', () => {
  let component: InauguralComponent;
  let fixture: ComponentFixture<InauguralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InauguralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InauguralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
