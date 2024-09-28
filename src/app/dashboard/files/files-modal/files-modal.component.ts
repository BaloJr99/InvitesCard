import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMessageResponse } from 'src/app/core/models/common';
import { IDeleteImage } from 'src/app/core/models/images';
import { ImagesService } from 'src/app/core/services/images.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-files-modal',
  templateUrl: './files-modal.component.html',
  styleUrls: ['./files-modal.component.css'],
})
export class FilesModalComponent {
  @Input() imageAction!: IDeleteImage;
  @Output() updateImages: EventEmitter<IDeleteImage> = new EventEmitter();

  constructor(
    private imagesService: ImagesService,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {}

  hideModal(): void {
    $('#warningDialog').modal('hide');
  }

  deleteImage(): void {
    this.loaderService.setLoading(true, $localize`Eliminando imagen`);
    this.imagesService
      .deleteImage(this.imageAction)
      .subscribe({
        next: (response: IMessageResponse) => {
          this.hideModal();
          this.updateImages.emit(this.imageAction);
          this.toastr.success(response.message);
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }
}