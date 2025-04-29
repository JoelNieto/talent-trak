import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemTypesFormComponent } from './item-types-form.component';

describe('ItemTypesFormComponent', () => {
  let component: ItemTypesFormComponent;
  let fixture: ComponentFixture<ItemTypesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemTypesFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemTypesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
