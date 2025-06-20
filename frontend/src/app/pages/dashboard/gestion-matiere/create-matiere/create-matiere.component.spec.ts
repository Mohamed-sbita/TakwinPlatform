import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMatiereComponent } from './create-matiere.component';

describe('CreateMatiereComponent', () => {
  let component: CreateMatiereComponent;
  let fixture: ComponentFixture<CreateMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMatiereComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
