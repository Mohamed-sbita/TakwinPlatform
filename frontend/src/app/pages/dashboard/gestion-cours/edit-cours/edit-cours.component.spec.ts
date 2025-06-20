import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCoursComponent } from './edit-cours.component';

describe('EditCoursComponent', () => {
  let component: EditCoursComponent;
  let fixture: ComponentFixture<EditCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
