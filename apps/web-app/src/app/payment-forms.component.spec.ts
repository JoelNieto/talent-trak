import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentFormsComponent } from './payment-forms.component';

describe('PaymentFormsComponent', () => {
  let component: PaymentFormsComponent;
  let fixture: ComponentFixture<PaymentFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFormsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
