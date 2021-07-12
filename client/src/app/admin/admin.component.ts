import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  // affiche tout les Posts
  public goPost() {
    this.route.navigate(['/admin/post'], {
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  // affiche tout les Users
  public goUser() {
    this.route.navigate(['/admin/user'], {
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }
}
