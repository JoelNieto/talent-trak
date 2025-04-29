import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChargeConceptsComponent } from './charge-concepts.component';

describe('ChargeConceptsComponent', () => {
  let component: ChargeConceptsComponent;
  let fixture: ComponentFixture<ChargeConceptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeConceptsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChargeConceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
