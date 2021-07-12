import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css'],
})
export class FriendListComponent implements OnInit, OnDestroy {
  public userList: User[];
  public idUser: string;
  public currentUserValue: User;
  public friendList: User[] = [];
  public checkFriend = false;
  public subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.idUser = paramMap.get('_id');

    });
    this.subscription = this.userService.fectchUser().subscribe((userData) => {
      this.userList = userData;

      this.userList.forEach((user) => {
        if (user._id === this.idUser) {
          this.currentUserValue = user;
          this.userList.forEach((users) => {
            this.currentUserValue.friendList.forEach((friend) => {
              if (friend === users._id) {
                this.friendList.push(users);

                if (this.friendList[0] === undefined) {
                  this.checkFriend = true;
                }
              }
            });
          });
        }
      });
    });
  }

  public deleteFriend(index) {
    this.subscription = this.userService
      .deleteUserFriendList(this.currentUserValue, index)
      .subscribe(() => {});
    const indexUser = this.friendList[index].friendList.indexOf(this.idUser);
    this.subscription = this.userService
      .deleteUserFriendList(this.friendList[index], indexUser)
      .subscribe(() => {});
  }

  public goFriendList(index) {
    this.route.navigate(['/friend-list-target'], {
      queryParams: { _idFriend: this.friendList[index]._id },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
