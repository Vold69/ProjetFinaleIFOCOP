import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JwtToken } from '../../models/jwt-token.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  public idUser: string;
  public jwtToken: JwtToken;
  public subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.idUser = paramMap.get('_id');
    });

    this.subscription = this.authService.jwtToken.subscribe((jwtToken: JwtToken) => {
      this.jwtToken = jwtToken;
    });
  }

  public logout(): void {
    // deuxieme système de deco ( au où bug )
    // a delete
    this.authService.logout2();
    // système de deco
    // this.subscription = this.authService.logout(this.idUser).subscribe(() => {
    //   this.router.navigate(['/']);
    // });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
