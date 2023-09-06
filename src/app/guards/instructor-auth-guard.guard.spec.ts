import { TestBed } from '@angular/core/testing';

import { InstructorAuthGuardGuard } from './instructor-auth-guard.guard';

describe('InstructorAuthGuardGuard', () => {
  let guard: InstructorAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InstructorAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
