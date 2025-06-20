import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireAbsencesComponent } from './stagiaire-absences.component';

describe('StagiaireAbsencesComponent', () => {
  let component: StagiaireAbsencesComponent;
  let fixture: ComponentFixture<StagiaireAbsencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireAbsencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StagiaireAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
