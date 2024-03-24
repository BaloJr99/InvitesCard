import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, combineLatest, take } from 'rxjs';
import { EventsService } from 'src/core/services/events.service';
import { ImagesService } from 'src/core/services/images.service';
import { LoaderService } from 'src/core/services/loader.service';
import { IDownloadImages, IEvent, IDeleteImage, IMessageResponse, IUpdateImageArray, IUpdateImage } from 'src/shared/interfaces';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent implements OnInit {
  events: IEvent[] = [];
  eventSelected: IEvent | undefined = undefined;

  images: IDownloadImages[] = [];
  imageAction!: IDeleteImage;
  scaleImageUrl = "";
  
  imageUpdateForm: FormArray<FormGroup<IUpdateImageArray>> = 
    new FormArray<FormGroup<IUpdateImageArray>>([])

  saveFilesForm: FormGroup = this.fb.group({
    photoFiles: '',
    photoFilesSource: '',
    musicFiles: '',
    musicFilesSource: ''
  });

  constructor(
    private loaderService: LoaderService,
    private eventsService: EventsService,
    private imagesService: ImagesService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit (): void {
    this.loaderService.setLoading(true);

    this.eventsService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
      }
    }).add(() => this.loaderService.setLoading(false));
  }

  searchImages(): void {
    this.clearInformation();
    this.eventSelected = this.events.find(event => event.id === $("#event-select").val());
    this.getLatestImages();
  }

  saveFiles(): void {
    if (this.saveFilesForm.controls["photoFilesSource"].value !== "" || this.saveFilesForm.controls["musicFilesSource"].value !== "") {
      this.loaderService.setLoading(true);
      const filesObservable: Observable<string>[] = [];
      Array.from(this.saveFilesForm.controls["photoFilesSource"].value as FileList).forEach(file => {
        const base64 = this.getBase64(file).pipe(
          take(1)
        );
        filesObservable.push(base64);
      });
      
      combineLatest(filesObservable).subscribe({
        next: (filesBase64) => {
          const apiCalls: Observable<IMessageResponse>[] = [];
          
          filesBase64.forEach((base64) => {
            apiCalls.push(this.imagesService.uploadImages({
              eventId: this.eventSelected?.id ?? "",
              image: base64
            }))
          });

          combineLatest(apiCalls).subscribe({
            next: (response) => {
              this.saveFilesForm.patchValue({
                photoFiles: '',
                photoFilesSource: '',
                musicFiles: '',
                musicFilesSource: ''
              });
              this.getLatestImages();
              this.toastr.success(response[0].message);
            }
          }).add(() => {
            this.loaderService.setLoading(false);
          });
        }
      });
    }
  }

  getLatestImages(): void {
    if (this.eventSelected) {
      this.imagesService.getImageByEvent(this.eventSelected.id).subscribe({
        next: (response) => {
          this.images = response;
        }
      }).add(() => this.loaderService.setLoading(false));
    }
  }
  
  updateImages(imageAction: IDeleteImage): void {
    this.images = this.images.filter(image => image.id !== imageAction.id);
  }

  showDeleteDialog (id: string): void {
    const imageFound = this.images.find(image => image.id === id);

    if (imageFound) {
      this.imageAction = imageFound;
      
      $("#warningDialog").modal("show");
    }
  }

  onPhotosChange (event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const errorFiles: string[] = []

    if (element.files) {
      Array.from(element.files).forEach(file => {
        if (file.size > 2097152) {
          errorFiles.push(file.name);
        }
      });

      if (errorFiles.length > 0) {
        this.saveFilesForm.patchValue({
          photoFiles: ''
        });
        this.toastr.error(`The file size limit is 2Mb: ${errorFiles.toString()}`);
      } else {
        this.saveFilesForm.patchValue({
          photoFilesSource: element.files
        });
      }
    }
  }

  getBase64(file: File): Observable<string> {
    return new Observable(obs => {
      const reader = new FileReader();
      reader.onload = () => {
        obs.next(reader.result as string);
        obs.complete();
      }
      reader.readAsDataURL(file);
    });
 }

 clearInformation(): void {
  this.saveFilesForm.patchValue({
    photoFiles: '',
    photoFilesSource: '',
    musicFiles: '',
    musicFilesSource: ''
  });

  this.images = [];
 }

 cancelChanges(): void {
  this.imageUpdateForm = new FormArray<FormGroup<IUpdateImageArray>>([]);
  this.searchImages();
 }

 saveChanges(): void {
  if (this.imageUpdateForm.valid && this.imageUpdateForm.controls.length > 0) {
    this.loaderService.setLoading(true)
    this.imagesService.updateImage(this.imageUpdateForm.value as IUpdateImage[]).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.imageUpdateForm = new FormArray<FormGroup<IUpdateImageArray>>([]);
      }
    }).add(() => this.loaderService.setLoading(false));
  }
 }

 insertUpdatedImage(event: Event): void {
  const element = event.currentTarget as HTMLSelectElement;

  const elementId = element.id.split('-').pop();
  
  if (!this.imageUpdateForm.invalid && elementId) {
    const imageUpdated = this.images[parseInt(elementId)];

    if (element.value !== (imageUpdated.imageUsage ?? '')) {
      this.imageUpdateForm.push(
        this.fb.group({
          id: new FormControl(imageUpdated.id),
          imageUsage: new FormControl(element.value)
        } as IUpdateImageArray)
      );
    } else {
      const indexOfRolledbackValue = this.imageUpdateForm.controls.findIndex(formGroup => formGroup.value.id === imageUpdated.id);
      
      if (indexOfRolledbackValue !== -1) {
        this.imageUpdateForm.removeAt(indexOfRolledbackValue);
      }
    }
  }
 }
}
