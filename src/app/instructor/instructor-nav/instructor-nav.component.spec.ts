import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorNavComponent } from './instructor-nav.component';

describe('InstructorNavComponent', () => {
  let component: InstructorNavComponent;
  let fixture: ComponentFixture<InstructorNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
