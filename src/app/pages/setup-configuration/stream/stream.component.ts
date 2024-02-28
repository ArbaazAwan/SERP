import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { VgAPI } from 'ngx-videogular';
@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnInit {
  socketData: any[] = [];
  api!: VgAPI;
  // videoSource =
  //   'rtsp://admin:Secure+123@192.168.0.239:554/Streaming/Channels/1';

  constructor(private socket: Socket) {
    this.socket = socket;
  }

  ngOnInit() {
    this.socket.fromEvent('server-event').subscribe((data: any) => {
      this.socketData = data;
    });
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
    this.api
      .getDefaultMedia()
      .subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
  }

  playVideo() {
    this.api.play();
  }
}
