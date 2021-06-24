import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { RegexpModule } from '../../shared/validator/regexp/regexp.module';

@Component({
  selector: 'app-user-modif-admin',
  templateUrl: './user-modif-admin.component.html',
  styleUrls: ['./user-modif-admin.component.css'],
})
export class UserModifAdminComponent implements OnInit, OnDestroy {
  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public hobbieCtrl = new FormControl();
  public filteredHobbie: Observable<string[]>;
  public hobbies: string[] = [];
  public allHobbies: string[] = [
    'Tennis',
    'Foot',
    'Baseball',
    'Jeux-Video',
    'Livre',
  ];

  public isChecked = true;
  public idTarget: string;
  public erreur: string;
  public target: User;
  public subscription: Subscription = new Subscription();
  public editForm: FormGroup;
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
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private regex: RegexpModule
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.idTarget = paramMap.get('target');
    });

    this.subscription = this.userService.fectchUserSelect(this.idTarget).subscribe((user: User) => {
      this.target = user;
    });

    this.editForm = this.fb.group({
      prenom: null,
      nom: null,
      adresse: null,
      age: null,
      username: [null, Validators.minLength(4)],
      email: [null, Validators.email],
      presentation: null,
      password: [null, Validators.pattern(this.regex.PASSWORD || null)],
      preferences: [this.hobbies],
      genre: null,
      isAdmin: false,
      lastModif: [Date.now()],
    });

    this.subscription = this.subscription = this.editForm.statusChanges.subscribe(() => {
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

  public trySend() {
    console.log(this.editForm);
    if (this.editForm.valid) {
        if (this.editForm.value.prenom === null) {
          this.editForm.value.prenom = this.target.prenom;
        }
        if (this.editForm.value.nom === null) {
          this.editForm.value.nom = this.target.nom;
        }
        if (this.editForm.value.adresse === null) {
          this.editForm.value.adresse = this.target.adresse;
        }
        if (this.editForm.value.age === null) {
          this.editForm.value.age = this.target.age;
        }
        if (this.editForm.value.username === null) {
          this.editForm.value.username = this.target.username;
        }
        if (this.editForm.value.email === null) {
          this.editForm.value.email = this.target.email;
        }
        if (this.editForm.value.password === null) {
          delete this.editForm.value.password;
          delete this.editForm.value.passConf;
        }
        if (this.editForm.value.presentation === null) {
          this.editForm.value.presentation = this.target.presentation;
        }
        if (this.editForm.value.preferences[0] === null) {
          this.editForm.value.preferences = this.target.preferences;
        }
        if (this.editForm.value.genre === null) {
          this.editForm.value.genre = this.target.genre;
        }
        console.log(1);

        return this.userService
          .editUserAdmin(this.target._id, this.editForm.value)
          .subscribe(() => {console.log(2);
          }, (error) => {
            this.erreur = error;
            console.log(this.erreur);
          });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
