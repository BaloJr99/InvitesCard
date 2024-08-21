import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IDeleteImage } from 'src/app/core/models/images';
import { ImagesService } from 'src/app/core/services/images.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  @Input() imageAction!: IDeleteImage;
  @Output() updateImages: EventEmitter<IDeleteImage> = new EventEmitter();

  constructor(
    private imagesService: ImagesService,
    private toastr: ToastrService,
    private loaderService: LoaderService) { }

  hideModal(): void {
    $("#warningDialog").modal("hide");
  }

  deleteImage(): void {
    this.loaderService.setLoading(true);
    this.imagesService.deleteImage(this.imageAction).subscribe({
      next: () => {
        this.hideModal();
        this.updateImages.emit(this.imageAction);
        this.toastr.success($localize `Se ha eliminado el archivo`);
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }
}
 