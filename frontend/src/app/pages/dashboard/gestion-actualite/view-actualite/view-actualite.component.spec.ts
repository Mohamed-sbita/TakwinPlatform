import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActualiteComponent } from './view-actualite.component';

describe('ViewActualiteComponent', () => {
  let component: ViewActualiteComponent;
  let fixture: ComponentFixture<ViewActualiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewActualiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
