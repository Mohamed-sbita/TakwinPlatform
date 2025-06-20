import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEmploisComponent } from './gestion-emplois.component';

describe('GestionEmploisComponent', () => {
  let component: GestionEmploisComponent;
  let fixture: ComponentFixture<GestionEmploisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEmploisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionEmploisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
