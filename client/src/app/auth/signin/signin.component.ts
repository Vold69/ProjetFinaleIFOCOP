import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { RegexpModule } from '../../shared/validator/regexp/regexp.module';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit, OnDestroy {
  public signinForm: FormGroup;
  public error: string;
  public _id: string;
  public subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private regex: RegexpModule
  ) {}

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.pattern(this.regex.PASSWORD)],
      ],
    });
  }

  public trySignin() {
    this.subscription = this.userService
      .fectchUserSelected(this.signinForm.value.email)
      .subscribe((data) => {
        this._id = data._id;
      });
    this.subscription = this.authService.signin(this.signinForm.value).subscribe(
      () => {
        this.router.navigate(['/homepageUser/:_idDomaine'], {
          relativeTo: this.activatedRoute,
          queryParams: { _id: this._id, _idDomaine: this._id },
          queryParamsHandling: 'merge',
          preserveFragment: true,
        });
      },
      (err) => {
        this.error = err.error;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
