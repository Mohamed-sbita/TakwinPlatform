import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAttendanceComponent } from './gestion-attendance.component';

describe('GestionAttendanceComponent', () => {
  let component: GestionAttendanceComponent;
  let fixture: ComponentFixture<GestionAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAttendanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
