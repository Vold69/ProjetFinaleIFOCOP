import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css'],
})
export class FriendRequestComponent implements OnInit, OnDestroy {
  public dataCurrentUser: User;
  public datafriendUser: User[];
  public requestUser: User[] = [];
  public waitUser: User[] = [];
  public valeur: User;
  public checkRequest = false;
  public checkWait = false;
  public compteur = 0;
  public compteur2 = 0;
  public subscription: Subscription = new Subscription();


  constructor(private userService: UserService, private route: Router) {}

  ngOnInit(): void {
    this.subscription = this.userService.getCurrentUser().subscribe((data) => {
      this.dataCurrentUser = data;
      console.log(data);
    });
    this.subscription = this.userService.fectchUser().subscribe((data) => {
      this.datafriendUser = data;

      this.datafriendUser.forEach((user) => {
        this.dataCurrentUser.waitConf.forEach((wait) => {
          if (user._id === wait) {
            this.waitUser.push(user);
          }
        });
      });

      this.datafriendUser.forEach((user) => {
        this.dataCurrentUser.friendRequest.forEach((wait) => {
          if (user._id === wait) {
            this.requestUser.push(user);
          }
        });
      });
      console.log(this.requestUser);
      if (this.requestUser[0] === undefined) {
        this.checkRequest = true;
      }

      if (this.waitUser[0] === undefined) {
        this.checkWait = true;
      }
    });
  }

  public addFriend(index: number) {
    this.datafriendUser.forEach((user) => {
      if (user._id === this.dataCurrentUser.friendRequest[index]) {
        this.valeur = user;
      }
    });
    this.valeur.waitConf.forEach((user) => {
      if (this.dataCurrentUser._id === user) {
        return this.compteur;
      }
      this.compteur++;
    });
    // permet d'ajoute une idUser a la liste d'amis
    this.subscription = this.userService
      .addFriendList(this.dataCurrentUser, this.compteur, this.valeur)
      .subscribe(() => {});
    // permet d'ajoute l'idtarget a la liste d'amis
    this.subscription = this.userService
      .addUserFriendList(this.dataCurrentUser, index)
      .subscribe(() => {
        this.route.navigate(['/profile'], {
          queryParamsHandling: 'merge',
          preserveFragment: true,
        });
      });
  }

  public deniedFriend(index: number) {
    this.datafriendUser.forEach((user) => {
      if (user._id === this.dataCurrentUser.friendRequest[index]) {
        this.valeur = user;
      }
    });
    this.valeur.waitConf.forEach((user) => {
      if (this.dataCurrentUser._id === user) {
        return this.compteur2;
      }
      this.compteur2++;
    });
    // permet de retiré la demande d'amis de l'array request
    this.subscription = this.userService
      .deniedUserFriend(this.dataCurrentUser, index)
      .subscribe(() => {});

    // permet de retiré la demande d'amis de l'array waitConf
    this.subscription = this.userService
      .deniedTargetFriend(this.valeur, this.compteur2)
      .subscribe(() => {
        this.route.navigate(['/profile'], {
          queryParamsHandling: 'merge',
          preserveFragment: true,
        });
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
