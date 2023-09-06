import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFeedbacksComponent } from './student-feedbacks.component';

describe('StudentFeedbacksComponent', () => {
  let component: StudentFeedbacksComponent;
  let fixture: ComponentFixture<StudentFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentFeedbacksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
