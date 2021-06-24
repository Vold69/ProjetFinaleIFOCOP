import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegexpModule } from '../../shared/validator/regexp/regexp.module';
import { map, startWith } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  public currentUser: Observable<User>;
  public subscription: Subscription = new Subscription();
  public userData: User;
  public editForm: FormGroup;
  public error: string;

  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public hobbieCtrl = new FormControl();
  public filteredHobbie: Observable<string[]>;
  public hobbies: string[] = ['Sport'];
  public allHobbies: string[] = [
    'Tennis',
    'Foot',
    'Baseball',
    'Jeux-Video',
    'Livre',
  ];
  public genres: string[] = ['Homme', 'Femme', 'Autre', 'Non Definie'];

  public erreursForm = {
    username: '',
    email: '',
    password: '',
    genre: '',
  };
  public messageError = {
    username: {
      minlength: 'Votre pseudonyme doit avoir au moins 4 caractères.',
    },
    email: {
      email: 'Rentrez une adresse email valide.',
    },
    password: {
      pattern: 'le mot de passe comprend 8 caractères 1 lettre et 1 chiffre',
    },
  };

  @ViewChild('hobbieInput') hobbieInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: Router,
    private regex: RegexpModule
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.subscription = this.currentUser.subscribe((data) => {
      this.userData = data;
    });
    this.editForm = this.fb.group({
      prenom: null,
      nom: null,
      adresse: null,
      age: null,
      username: [null, Validators.minLength(4)],
      email: [null, Validators.email],
      password: [null, Validators.pattern(this.regex.PASSWORD || null)],
      passConf: [null, Validators.pattern(this.regex.PASSWORD || null)],
      presentation: null,
      preferences: [this.hobbies],
      genre: null,
      lastModif: [Date.now()],
    });

    this.subscription = this.editForm.statusChanges.subscribe(() => {
      this.changementStatusForm();
    });

    this.filteredHobbie = this.hobbieCtrl.valueChanges.pipe(
      startWith(null),
      map((hobbie: string | null) =>
        hobbie ? this._filter(hobbie) : this.allHobbies.slice()
      )
    );
  }

  public changementStatusForm() {
    if (!this.editForm) {
      return;
    }
    const form = this.editForm;
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

  public add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our hobbie
    if (value) {
      this.hobbies.push(value);
    }

    this.hobbieCtrl.setValue(null);
  }

  public remove(hobbie: string): void {
    const index = this.hobbies.indexOf(hobbie);

    if (index >= 0) {
      this.hobbies.splice(index, 1);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.hobbies.push(event.option.viewValue);
    this.hobbieInput.nativeElement.value = '';
    this.hobbieCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allHobbies.filter(
      (hobbie) => hobbie.toLowerCase().indexOf(filterValue) === 0
    );
  }

  public editProfil(_id: string) {
    if (this.editForm.valid) {
      if (this.editForm.value.password === this.editForm.value.passConf) {
        if (this.editForm.value.prenom === null) {
          this.editForm.value.prenom = this.userData.prenom;
        }
        if (this.editForm.value.nom === null) {
          this.editForm.value.nom = this.userData.nom;
        }
        if (this.editForm.value.adresse === null) {
          this.editForm.value.adresse = this.userData.adresse;
        }
        if (this.editForm.value.age === null) {
          this.editForm.value.age = this.userData.age;
        }
        if (this.editForm.value.username === null) {
          this.editForm.value.username = this.userData.username;
        }
        if (this.editForm.value.email === null) {
          this.editForm.value.email = this.userData.email;
        }
        if (this.editForm.value.password === null) {
          delete this.editForm.value.password;
          delete this.editForm.value.passConf;
        }
        if (this.editForm.value.presentation === null) {
          this.editForm.value.presentation = this.userData.presentation;
        }
        if (this.editForm.value.preferences[0] === null) {
          this.editForm.value.preferences = this.userData.preferences;
        }
        if (this.editForm.value.genre === null) {
          this.editForm.value.genre = this.userData.genre;
        }
        return this.userService
          .editUser(_id, this.editForm.value)
          .subscribe(() => {
            this.route.navigate(['/profile'], {
              queryParamsHandling: 'merge',
              preserveFragment: true,
            });
          }, (error) => {
            this.error = error;
            console.log(this.error);
          });
      }
    }
  }

  public annuler() {
    this.route.navigate(['/profile'], {
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
