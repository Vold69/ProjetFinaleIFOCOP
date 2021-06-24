import { Component, OnInit } from '@angular/core';
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
    const socket = socketIo('https://myreseaux.herokuapp.com/');

    socket.on('User', (user) => {
      this.numbreConnect = user.User.length;
    });

    socket.on('Post', (post) => {
      this.numbrePost = post.Post.length;
    });
  }
}
