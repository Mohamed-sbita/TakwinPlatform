import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirCourComponent } from './voir-cour.component';

describe('VoirCourComponent', () => {
  let component: VoirCourComponent;
  let fixture: ComponentFixture<VoirCourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoirCourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoirCourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
