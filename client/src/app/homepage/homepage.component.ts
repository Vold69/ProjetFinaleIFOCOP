import { Component, OnDestroy, OnInit } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  public numbreConnect = 0;
  public numbrePost = 0;

  constructor() {}

  ngOnInit(): void {
  }

}
