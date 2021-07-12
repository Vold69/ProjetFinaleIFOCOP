import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  public lookUser: BehaviorSubject<User[]> = new BehaviorSubject(null);
  public lookUserSelected: BehaviorSubject<User> = new BehaviorSubject(null);
  public lookUserSelect: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getUser: string;
  public userEdit: string;
  public userEditAdmin: string;
  public userDelete: string;

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/user/current').pipe(
      tap((user: User) => {
        this.currentUser.next(user);
      }),
      switchMap(() => {
        return this.currentUser;
      })
    );
  }

  public fectchUser(): Observable<User[]> {
    return this.http.get<User[]>('/api/user/look').pipe(
      tap((data: User[]) => {
        this.lookUser.next(data);
        return this.lookUser;
      })
    );
  }

  public fectchUserSelected(value: string): Observable<User> {
    this.getUser = '/api/user/lookSelected/' + value;

    return this.http.get<User>(this.getUser).pipe(
      tap((data: User) => {
        if (data.isAdmin === true) {
          const token = localStorage.getItem('jwt');
          this.authService.jwtToken.next({
            isAuthenticated: true,
            isAdmin: true,
            token: token,
          });
        }
        this.lookUserSelected.next(data);
      }),
      switchMap(() => {
        return this.lookUserSelected;
      })
    );
  }

  public fectchUserSelect(values: string): Observable<User> {
    this.getUser = '/api/user/lookSelect/' + values;

    return this.http.get<User>(this.getUser).pipe(
      tap((data: User) => {
        this.lookUserSelect.next(data);
        return this.lookUserSelect.value;
      })
    );
  }

  public editUser(_id: string, user: User): Observable<User> {
    this.userEdit = '/api/user/edit/' + _id;

    return this.http.post<User>(this.userEdit, user);
  }

  public editUserAdmin(_id: string, user: User): Observable<User> {
    this.userEditAdmin = '/api/user/editAdmin/' + _id;
    console.log(user);

    return this.http.post<User>(this.userEditAdmin, user);
  }

  public removeUser(_id: string): Observable<User> {
    this.userDelete = '/api/user/delete/' + _id;

    return this.http.delete<User>(this.userDelete);
  }

  public removeUserModif(allUser: User[]): Observable<User[]> {
    return this.http.post<User[]>('/api/user/modifAll', allUser);
  }

  public addFriendRequest(user: User, requestID: string): Observable<User> {
    if (!user.friendList.includes(requestID) || !user.waitConf.includes(requestID) || !user.friendRequest.includes(requestID)) {
      user.friendRequest.push(requestID);
    }
    return this.http.post<User>('/api/user/addFriendRequest', user);
  }

  public addFriendWaitConf(user: User, idFriend: string) {
    user.waitConf.push(idFriend);
    return this.http.post<User>('/api/user/addListFriend', user);
  }

  public addUserFriendList(user: User, index: number): Observable<User> {
    user.friendList.push(user.friendRequest[index]);
    user.friendRequest.splice(index, 1);
    return this.http.post<User>('/api/user/addListFriend', user);
  }

  public addFriendList(
    user: User,
    index: number,
    friendUser: User
  ): Observable<User> {
    friendUser.friendList.push(user._id);
    friendUser.waitConf.splice(index, 1);
    return this.http.post<User>('/api/user/addListFriend', friendUser);
  }

  public deniedUserFriend(user: User, index: number) {
    user.friendRequest.splice(index, 1);
    return this.http.post<User>('/api/user/addListFriend', user);
  }

  public deniedTargetFriend(userTarget: User, index: number) {
    userTarget.waitConf.splice(index, 1);
    return this.http.post<User>('/api/user/addListFriend', userTarget);
  }

  public deleteUserFriendList(user: User, index: number): Observable<User> {
    user.friendList.splice(index, 1);
    return this.http.post<User>('/api/user/addListFriend', user);
  }
}
