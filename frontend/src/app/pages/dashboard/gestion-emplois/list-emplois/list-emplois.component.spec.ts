import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmploisComponent } from './list-emplois.component';

describe('ListEmploisComponent', () => {
  let component: ListEmploisComponent;
  let fixture: ComponentFixture<ListEmploisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEmploisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListEmploisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
