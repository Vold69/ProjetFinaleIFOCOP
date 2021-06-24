import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, timer } from 'rxjs';
import { User } from '../models/user.model';
import { JwtToken } from '../models/jwt-token.model';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public subscription: Subscription;
  public userData: BehaviorSubject<User> = new BehaviorSubject(null);

  public Urlpass: string;
  public Urldata: string;

  public jwtToken: BehaviorSubject<JwtToken> = new BehaviorSubject({
    isAuthenticated: null,
    isAdmin: null,
    token: null,
  });

  constructor(private http: HttpClient, private router: Router) {
    this.initToken();
    this.subscription = this.initTimer();
  }

  public initTimer() {
    return timer(300000, 600000)
      .pipe(
        switchMap(() => {
          if (localStorage.getItem('jwt')) {
            return this.http.get<string>('/api/auth/refresh-token').pipe(
              tap((token: string) => {
                if (this.jwtToken.value.isAdmin === true) {
                  this.jwtToken.next({
                    isAuthenticated: true,
                    isAdmin: true,
                    token: token,
                  });
                } else {
                  this.jwtToken.next({
                    isAuthenticated: true,
                    isAdmin: false,
                    token: token,
                  });
                }
                localStorage.setItem('jwt', token);
              })
            );
          } else {
            // this.subscription.unsubscribe();
            return of(null);
          }
        })
      )
      .subscribe(
        () => {},
        (err) => {
          this.jwtToken.next({
            isAuthenticated: false,
            isAdmin: false,
            token: null,
          });
          localStorage.removeItem('jwt');
          // this.subscription.unsubscribe();
        }
      );
  }

  private initToken(): void {
    const token = localStorage.getItem('jwt');
    if (token) {
      if (this.jwtToken.value.isAdmin === true) {
        this.jwtToken.next({
          isAuthenticated: true,
          isAdmin: true,
          token: token,
        });
      } else {
        this.jwtToken.next({
          isAuthenticated: true,
          isAdmin: false,
          token: token,
        });
      }
    } else {
      this.jwtToken.next({
        isAuthenticated: false,
        isAdmin: false,
        token: null,
      });
    }
  }

  public signup(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/signup', user);
  }

  public signin(credentials: {
    email: string;
    password: string;
  }): Observable<string> {
    return this.http.post<string>('/api/auth/signin', credentials).pipe(
      tap((token: string) => {
        if (this.jwtToken.value.isAdmin === true) {
          this.jwtToken.next({
            isAuthenticated: true,
            isAdmin: true,
            token: token,
          });
        } else {
          this.jwtToken.next({
            isAuthenticated: true,
            isAdmin: false,
            token: token,
          });
        }
        localStorage.setItem('jwt', token);
        this.subscription = this.initTimer();
      })
    );
  }

  public logout(value: string): Observable<string> {
    return this.http.post<string>('api/auth/logout', { value }).pipe(
      tap(() => {
        this.jwtToken.next({
          isAuthenticated: false,
          isAdmin: false,
          token: null,
        });
        localStorage.removeItem('jwt');
      })
    );
  }

  // a delete
  public logout2(): void {
        this.jwtToken.next({
          isAuthenticated: false,
          isAdmin: false,
          token: null,
        });
        localStorage.removeItem('jwt');
  }

  public lookpassword(email: string): Observable<string> {
    return this.http.post<string>('api/auth/lookpassword/', email);
  }

  public changePassword(user: User): Observable<User> {
    return this.http.post<User>('api/auth/changepassword', user);
  }

  public getData(_id: string): Observable<User> {
    this.Urldata = 'api/auth/data/' + _id;

    return this.http.get<User>(this.Urldata).pipe(
      tap((data: User) => {
        this.userData.next(data);
      }),
      switchMap(() => {
        return this.userData;
      })
    );
  }
}
