import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstructorsComponent } from './admin-instructors.component';

describe('AdminInstructorsComponent', () => {
  let component: AdminInstructorsComponent;
  let fixture: ComponentFixture<AdminInstructorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInstructorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInstructorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
