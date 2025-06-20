import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsFromateurComponent } from './stats-fromateur.component';

describe('StatsFromateurComponent', () => {
  let component: StatsFromateurComponent;
  let fixture: ComponentFixture<StatsFromateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsFromateurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsFromateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
