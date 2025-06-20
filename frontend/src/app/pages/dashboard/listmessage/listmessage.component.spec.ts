import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListmessageComponent } from './listmessage.component';

describe('ListmessageComponent', () => {
  let component: ListmessageComponent;
  let fixture: ComponentFixture<ListmessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListmessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
