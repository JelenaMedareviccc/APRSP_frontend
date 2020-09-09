import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsPercentageForClientsComponent } from './payments-percentage-for-clients.component';

describe('PaymentsPercentageForClientsComponent', () => {
  let component: PaymentsPercentageForClientsComponent;
  let fixture: ComponentFixture<PaymentsPercentageForClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsPercentageForClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsPercentageForClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
