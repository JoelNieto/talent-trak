import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooleanIconComponent } from './boolean-icon.component';

describe('BooleanIconComponent', () => {
  let component: BooleanIconComponent;
  let fixture: ComponentFixture<BooleanIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooleanIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooleanIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
