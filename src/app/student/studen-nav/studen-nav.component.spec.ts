import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudenNavComponent } from './studen-nav.component';

describe('StudenNavComponent', () => {
  let component: StudenNavComponent;
  let fixture: ComponentFixture<StudenNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudenNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudenNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
