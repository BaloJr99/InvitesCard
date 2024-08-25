import { Injectable } from "@angular/core";
import { io } from "socket.io-client";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  io = io(environment.apiUrl, {
    withCredentials: true,
    autoConnect: true
  })

  joinRoom (username: string): void {
    this.io.emit("joinRoom", username);
  }

  sendNotification (userId: string) {
    this.io.emit("sendNotification", userId)
  }
}