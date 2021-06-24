import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
})
export class ListUserComponent implements OnInit, OnDestroy {
  public lookUserDetail: User[];
  public recoUser: User[] = [];
  public currentUserVal: User;
  public _id: string;
  public search = '';
  public subscription: Subscription = new Subscription();


  constructor(private userService: UserService, private route: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this._id = paramMap.get('_id');
    });
    this.subscription = this.userService.getCurrentUser().subscribe((data) => {
      this.currentUserVal = data;
    });
    this.subscription = this.userService.fectchUser().subscribe((lookUser: User[]) => {
      this.lookUserDetail = lookUser;
      this.lookUserDetail.forEach((user) => {
        const trigger = Math.random();
        user.preferences.forEach((userHobbie) => {
          this.currentUserVal.preferences.forEach((hobbie) => {
            if (
              userHobbie === hobbie &&
              trigger >= 0.5 &&
              !this.recoUser.includes(user)
            ) {
              this.recoUser.push(user);
            }
          });
        });
      });
      this.lookUserDetail.forEach((user) => {
        let compteur = 0;
        if (user._id === this.currentUserVal._id) {
          this.lookUserDetail.splice(compteur, 1);
        }
        compteur++;
      });

      this.recoUser.forEach((user) => {
        let compteur = 0;
        if (user._id === this.currentUserVal._id) {
          this.recoUser.splice(compteur, 1);
        }
        compteur++;
      });

      this.lookUserDetail.forEach((user) => {
        let compteur = 0;
        this.currentUserVal.friendList.forEach((friend) => {
          if (user._id === friend) {
            this.lookUserDetail.splice(compteur, 1);
          }
        });
        compteur++;
      });

      this.recoUser.forEach((user) => {
        let compteur = 0;
        this.currentUserVal.friendList.forEach((friend) => {
          if (user._id === friend) {
            this.recoUser.splice(compteur, 1);
          }
        });
        compteur++;
      });

      this.lookUserDetail.forEach((user) => {
        let compteur = 0;
        this.currentUserVal.waitConf.forEach((waitC) => {
          if (user._id === waitC) {
            this.lookUserDetail.splice(compteur, 1);
          }
        });
        compteur++;
      });

      this.recoUser.forEach((user) => {
        let compteur = 0;
        this.currentUserVal.waitConf.forEach((waitC) => {
          if (user._id === waitC) {
            this.recoUser.splice(compteur, 1);
          }
        });
        compteur++;
      });

      this.lookUserDetail.forEach((user) => {
        let compteur = 0;
        this.currentUserVal.friendRequest.forEach((request) => {
          if (user._id === request) {
            this.lookUserDetail.splice(compteur, 1);
          }
        });
        compteur++;
      });

      this.recoUser.forEach((user) => {
        let compteur = 0;
        this.currentUserVal.friendRequest.forEach((request) => {
          if (user._id === request) {
            this.recoUser.splice(compteur, 1);
          }
        });
        compteur++;
      });
    });
  }

  public addFriend(index) {
    // permet d'ajouter l'idUser a la liste de request de la target
    this.subscription = this.userService
      .addFriendRequest(this.lookUserDetail[index], this.currentUserVal._id)
      .subscribe(() => {});

    this.subscription = this.userService
      .addFriendWaitConf(this.currentUserVal, this.lookUserDetail[index]._id)
      .subscribe(() => {
        this.route.navigate(['/profile'], {
          queryParamsHandling: 'merge',
          preserveFragment: true,
        });
      });
  }

  public addFriendSearch(index) {
    // permet d'ajouter l'idUser a la liste de request de la target
    this.subscription = this.userService
      .addFriendRequest(this.recoUser[index], this.currentUserVal._id)
      .subscribe(() => {});

    this.subscription = this.userService
      .addFriendWaitConf(this.currentUserVal, this.recoUser[index]._id)
      .subscribe(() => {
        this.route.navigate(['/profile'], {
          queryParamsHandling: 'merge',
          preserveFragment: true,
        });
      });
  }

  public goFriendList(index) {
    this.route.navigate(['/friend-list-target'], {
      queryParams: { _idFriend: this.lookUserDetail[index]._id },
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
