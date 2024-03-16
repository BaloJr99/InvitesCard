import { Component } from '@angular/core';
import { SocketService } from 'src/core/services/socket.service';
import { LoaderService } from 'src/core/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    private socket: SocketService,
    private loaderService: LoaderService) {
      
  }
}
