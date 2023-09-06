import { TestBed } from '@angular/core/testing';

import { Authguard } from './authguard.guard';

describe('AuthguardGuard', () => {
  let guard: Authguard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(Authguard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
