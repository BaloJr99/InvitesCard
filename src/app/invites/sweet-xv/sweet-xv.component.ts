import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DesignType } from 'src/app/core/models/enum';
import { SweetXvClassicComponent } from './xv-classic/xv-classic.component';
import { SweetXvModernComponent } from './xv-modern/xv-modern.component';

@Component({
  selector: 'app-sweet-xv',
  templateUrl: './sweet-xv.component.html',
  styleUrls: ['./sweet-xv.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [SweetXvClassicComponent, SweetXvModernComponent],
})
export class SweetXvComponent {
  @Input() designName: string = '';

  designType = DesignType;
}
