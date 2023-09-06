import { TestBed } from '@angular/core/testing';

import { AdminAuthGuardGuard } from './admin-auth-guard.guard';

describe('AdminAuthGuardGuard', () => {
  let guard: AdminAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
