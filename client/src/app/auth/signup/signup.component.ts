import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { RegexpModule } from '../../shared/validator/regexp/regexp.module';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  public signupForm: FormGroup;
  // public maxSize = 104857600;
  public subscription: Subscription = new Subscription();

  public genres: string[] = ['Homme', 'Femme', 'Autre', 'Non Definie'];

  public messageError = {
    username: {
      required: 'Ce champ est requis.',
      minlength: 'Votre pseudonyme doit avoir au moins 4 caractères.',
    },
    email: {
      required: 'Ce champ est requis.',
      email: 'Rentrez une adresse email valide.',
    },
    password: {
      required: 'Ce champ est requis.',
      pattern: 'le mot de passe comprend 8 caractères 1 lettre et 1 chiffre',
    },
    genre: {
      required: 'Ce champ est requis.',
    },
  };
  public erreursForm = {
    username: '',
    email: '',
    password: '',
    genre: '',
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private regex: RegexpModule
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      prenom: [''],
      nom: [''],
      adresse: [''],
      age: [''],
      presentation: [''],
      preferences: [['']],
      // avatar: ['', FileValidator.maxContentSize(this.maxSize)],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.pattern(this.regex.PASSWORD)],
      ],
      username: ['', [Validators.required, Validators.minLength(4)]],
      friendList: [['']],
      friendRequest: [['']],
      waitConf: [['']],
      genre: [''],
      isAdmin: [false],
      creatDate: [Date.now()],
      lastModif: [Date.now()],
      isConnect: [false],
    });

    this.subscription = this.signupForm.statusChanges.subscribe(() => {
      this.changementStatusForm();
    });
  }

  public changementStatusForm() {
    if (!this.signupForm) {
      return;
    }
    const form = this.signupForm;
    // tslint:disable-next-line: forin
    for (const field in this.erreursForm) {
      this.erreursForm[field] = '';
      console.log('erreur field=', this.erreursForm[field]);
      const control = form.get(field);
      if (control && control.touched && control.invalid) {
        const messages = this.messageError[field];
        // tslint:disable-next-line: forin
        for (const key in control.errors) {
          this.erreursForm[field] += messages[key] + ' ';
        }
      }
    }
  }

  public trySignup() {
    if (this.signupForm.valid) {
      this.subscription = this.authService
        .signup(this.signupForm.value)
        .subscribe(() => {
          this.router.navigate(['/signin']);
        });
    }
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
