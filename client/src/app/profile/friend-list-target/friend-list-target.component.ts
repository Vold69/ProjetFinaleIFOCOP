import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-friend-list-target',
  templateUrl: './friend-list-target.component.html',
  styleUrls: ['./friend-list-target.component.css'],
})
export class FriendListTargetComponent implements OnInit, OnDestroy {
  public userList: User[];
  public idTarget: string;
  public currentUserValue: User;
  public friendList: User[] = [];
  public checkFriend = false;
  public subscription: Subscription = new Subscription();


  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.idTarget = paramMap.get('_idFriend');
    });
    this.subscription = this.userService.fectchUser().subscribe((userData) => {
      this.userList = userData;
      this.userList.forEach((user) => {
        if (user._id === this.idTarget) {
          this.currentUserValue = user;
          if (this.currentUserValue.friendList !== undefined) {
            this.currentUserValue.friendList.forEach((friend) => {
              this.userList.forEach((users) => {
                if (friend === users._id) {
                  this.friendList.push(users);
                }
              });
            });
          }
        }
      });
      if (this.friendList[0] === undefined) {
        this.checkFriend = true;
      }
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
