import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActualiteComponent } from './edit-actualite.component';

describe('EditActualiteComponent', () => {
  let component: EditActualiteComponent;
  let fixture: ComponentFixture<EditActualiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditActualiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
