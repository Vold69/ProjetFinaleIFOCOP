import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-look-password',
  templateUrl: './look-password.component.html',
  styleUrls: ['./look-password.component.css'],
})
export class LookPasswordComponent implements OnInit, OnDestroy {
  public emailForm: FormGroup;
  public subscription: Subscription = new Subscription();


  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public changePassword() {
    this.subscription = this.authService.lookpassword(this.emailForm.value).subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
