import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { IConfirmation } from '../models/invites';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  io = io(environment.url, {
    withCredentials: true,
    autoConnect: true,
  });

  joinRoom(username: string): void {
    this.io.emit('joinRoom', username);
  }

  sendNotification(confirmation: IConfirmation) {
    this.io.emit('sendNotification', confirmation);
  }
}
