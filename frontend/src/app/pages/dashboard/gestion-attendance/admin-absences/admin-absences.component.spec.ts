import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAbsencesComponent } from './admin-absences.component';

describe('AdminAbsencesComponent', () => {
  let component: AdminAbsencesComponent;
  let fixture: ComponentFixture<AdminAbsencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAbsencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
