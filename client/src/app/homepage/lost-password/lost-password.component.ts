import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.css'],
})
export class LostPasswordComponent implements OnInit, OnDestroy {
  public passwordForm: FormGroup;
  public _id: string;
  public userData: User;
  public error: string;
  public subscription: Subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    private authService: AuthService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.activetedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this._id = paramMap.get('_id');
    });
    this.subscription = this.authService.getData(this._id).subscribe((user: User) => {
      this.userData = user;
    });
    this.passwordForm = this.fb.group({
      password: [''],
      passwordVerif: [''],
    });
  }

  public changePassword() {
    if (
      this.passwordForm.value.password === this.passwordForm.value.passwordVerif
    ) {
      this.userData.password = this.passwordForm.value.password;
      this.subscription = this.authService.changePassword(this.userData).subscribe(() => {
        this.route.navigate(['signin']);
      });
    } else {
      return this.error;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
