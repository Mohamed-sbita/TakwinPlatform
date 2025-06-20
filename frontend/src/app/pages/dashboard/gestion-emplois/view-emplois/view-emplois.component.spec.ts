import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmploisComponent } from './view-emplois.component';

describe('ViewEmploisComponent', () => {
  let component: ViewEmploisComponent;
  let fixture: ComponentFixture<ViewEmploisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmploisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewEmploisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
