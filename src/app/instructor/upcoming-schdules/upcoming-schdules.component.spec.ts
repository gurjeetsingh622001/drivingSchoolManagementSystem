import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingSchdulesComponent } from './upcoming-schdules.component';

describe('UpcomingSchdulesComponent', () => {
  let component: UpcomingSchdulesComponent;
  let fixture: ComponentFixture<UpcomingSchdulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingSchdulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingSchdulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
