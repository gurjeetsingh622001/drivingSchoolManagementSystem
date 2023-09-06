import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSchedule1Component } from './create-schedule1.component';

describe('CreateSchedule1Component', () => {
  let component: CreateSchedule1Component;
  let fixture: ComponentFixture<CreateSchedule1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSchedule1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSchedule1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
