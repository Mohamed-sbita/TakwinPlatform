import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionActualiteComponent } from './gestion-actualite.component';

describe('GestionActualiteComponent', () => {
  let component: GestionActualiteComponent;
  let fixture: ComponentFixture<GestionActualiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionActualiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
