import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-friend-connect',
  templateUrl: './friend-connect.component.html',
  styleUrls: ['./friend-connect.component.css'],
})
export class FriendConnectComponent implements OnInit, OnDestroy {
  public idUser: string;
  public friends: User[] = [];
  public subscription: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe(
      (paramMap: ParamMap) => {
        this.idUser = paramMap.get('_id');
      }
    );

    this.subscription = this.userService.fectchUser().subscribe((data) => {
      const allUser = data;
      allUser.forEach((user) => {
        user.friendList.forEach((friend) => {
          if (friend === this.idUser) {
            this.friends.push(user);
          }
        });
      });
    });
  }

  public changeDomaine(index: number) {
    this.router.navigate(['/homepageUser/post-friend/:_idDomaine'], {
      relativeTo: this.activatedRoute,
      queryParams: { _idDomaine: this.friends[index]._id },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  public returnDomaine() {
    this.router.navigate(['/homepageUser/:_idDomaine'], {
      relativeTo: this.activatedRoute,
      queryParams: { _idDomaine: this.idUser },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
