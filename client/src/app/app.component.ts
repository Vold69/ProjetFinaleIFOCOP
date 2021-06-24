import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { User } from './shared/models/user.model';
import { Post } from './shared/models/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public socketUser: User[];
  public socketPost: Post[];



  constructor(private authService: AuthService) {}

  ngOnInit() {


  }
}
