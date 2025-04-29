import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChargeConceptsFormComponent } from './charge-concepts-form.component';

describe('ChargeConceptsFormComponent', () => {
  let component: ChargeConceptsFormComponent;
  let fixture: ComponentFixture<ChargeConceptsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeConceptsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChargeConceptsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
