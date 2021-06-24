import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-user-list-admin',
  templateUrl: './user-list-admin.component.html',
  styleUrls: ['./user-list-admin.component.css']
})
export class UserListAdminComponent implements OnInit, OnDestroy {
  public subscription: Subscription = new Subscription();
  public allUser: User[];

  constructor(private userService: UserService, private route: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.userService.fectchUser().subscribe((allUser: User[]) => {
      this.allUser = allUser;
    });
  }

  public upPost(index: number) {
    this.route.navigate(['/admin/create-post'], {
      relativeTo: this.activatedRoute,
      queryParams: { target: this.allUser[index]._id},
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  public modifUser(index: number) {
    this.route.navigate(['/admin/user-modif'], {
      relativeTo: this.activatedRoute,
      queryParams: { target: this.allUser[index]._id},
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  public deleteUser(index: number) {
    this.subscription = this.userService.removeUser(this.allUser[index]._id).subscribe(() => {
      this.subscription = this.userService.fectchUser().subscribe((allUser: User[]) => {
        this.allUser = allUser;
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
