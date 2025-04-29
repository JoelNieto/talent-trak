import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-image-upload',
  imports: [ImageCropperComponent, Button],
  template: `<input type="file" (change)="fileChangeEvent($event)" />
    <image-cropper
      [imageChangedEvent]="imageChangedEvent"
      [maintainAspectRatio]="true"
      [aspectRatio]="4 / 3"
      format="png"
      (imageCropped)="imageCropped($event)"
      (imageLoaded)="imageLoaded($event)"
      (cropperReady)="cropperReady()"
      (loadImageFailed)="loadImageFailed()"
    />

    <img [src]="croppedImage" alt="Cropped picture" />
    <div class="dialog-actions">
      <p-button
        label="Guardar"
        icon="pi pi-check"
        (click)="dialogRef.close(this.croppedImage)"
      />
      <p-button
        label="Cancelar"
        icon="pi pi-times"
        (click)="dialogRef.close()"
      />
    </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  private sanitizer = inject(DomSanitizer);
  public dialog = inject(DynamicDialogConfig);
  public dialogRef = inject(DynamicDialogRef);

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    const { objectUrl } = event;
    if (!objectUrl) {
      return;
    }
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
