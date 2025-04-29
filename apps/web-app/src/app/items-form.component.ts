import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { iif } from 'rxjs';
import { v4 } from 'uuid';
import { markGroupDirty } from './services/util.service';
import { GlobalStore } from './stores/global.store';

@Component({
  selector: 'app-items-form',
  imports: [InputText, Button, Select, ReactiveFormsModule],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class=" flex flex-col md:grid grid-cols-2 gap-4">
      <div class="col-span-2 flex flex-col md:flex-row gap-4">
        <img
          [src]="currentPictureUrl()"
          [alt]="form.get('name')?.value"
          class="cursor-pointer hover:opacity-60"
          width="100"
          tabindex="0"
          (click)="fileInput.click()"
          (keydown.enter)="fileInput.click()"
        />

        <input
          #fileInput
          type="file"
          class="hidden"
          (change)="selectImage($event)"
          accept="image/*"
        />
      </div>
      <div class="input-container ">
        <label for="name">Nombre</label>
        <input
          id="name"
          type="text"
          pInputText
          formControlName="name"
          placeholder="Nombre del rol"
        />
      </div>
      <div class="input-container ">
        <label for="type">Tipo</label>
        <p-select
          id="type"
          formControlName="type"
          [options]="store.itemTypes.entities()"
          optionLabel="name"
          optionValue="id"
          placeholder="Selecciona un tipo"
        />
      </div>
      <div class="input-container ">
        <label for="description">Descripción</label>
        <input
          id="description"
          type="text"
          pInputText
          formControlName="description"
          placeholder="Descripción del rol"
        />
      </div>
      <div class="input-container">
        <label for="quantity">Cantidad</label>
        <input
          id="quantity"
          type="number"
          pInputText
          formControlName="quantity"
          placeholder="Cantidad"
        />
      </div>
      <div class="input-container">
        <label for="price">Precio</label>
        <input
          id="price"
          type="number"
          pInputText
          formControlName="price"
          placeholder="Precio"
        />
      </div>
    </div>

    <div class="dialog-actions">
      <p-button
        label="Cancelar"
        icon="pi pi-times"
        (click)="dialogRef.close()"
        rounded
        severity="secondary"
      />
      <p-button
        label="Guardar"
        type="submit"
        rounded
        icon="pi pi-save"
        [loading]="store.items.isLoading()"
      />
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsFormComponent implements OnInit {
  public dialog = inject(DynamicDialogConfig);
  public dialogRef = inject(DynamicDialogRef);
  public store = inject(GlobalStore);
  public currentPictureUrl = signal<SafeUrl | string>('/images/no-picture.png');
  private messageService = inject(MessageService);
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', { nonNullable: true }),
    picture_url: new FormControl<string>('', { nonNullable: true }),
    picture: new FormControl<File | undefined>(undefined, {
      nonNullable: true,
    }),
    quantity: new FormControl(0, { nonNullable: true }),
    price: new FormControl(0, { nonNullable: true }),
    type: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    const { item } = this.dialog.data;

    if (item) {
      this.currentPictureUrl.set(
        item?.picture_url
          ? this.sanitizer.bypassSecurityTrustUrl(item.picture_url)
          : '/images/no-picture.png'
      );
      this.form.patchValue({
        id: item.id,
        name: item.name,
        description: item.description,
        picture_url: item.picture_url,
        quantity: item.quantity,
        price: item.price,
        type: item.type.id,
      });
    }
  }
  saveChanges() {
    if (this.form.invalid) {
      markGroupDirty(this.form);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los campos requeridos',
      });
      return;
    }

    if (this.form.pristine) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se han realizado cambios en el formulario',
      });
      return;
    }

    const formData = new FormData();
    const { id, name, type, description, price, quantity, picture } =
      this.form.getRawValue();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('price', price.toString());
    formData.append('quantity', quantity.toString());
    if (picture) {
      formData.append('picture', picture);
    }

    const { item: old } = this.dialog.data;

    iif(
      () => !!old,
      this.store.items.editItem({
        id: old?.id,
        request: formData,
      }),
      this.store.items.createItem(formData)
    ).subscribe({
      next: () => {
        this.dialogRef.close();
      },
    });
  }

  selectImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const objectUrl = reader.result as string;
      const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
      this.currentPictureUrl.set(sanitizedUrl);
      this.form.patchValue({
        picture: file,
      });
    };
  }
}
