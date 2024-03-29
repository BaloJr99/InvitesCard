import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/core/services/loader.service';
import { ImagesService } from 'src/core/services/images.service';
import { IDeleteImage } from 'src/shared/interfaces';

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
        this.toastr.success("Se ha eliminado el archivo");
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }
}
 