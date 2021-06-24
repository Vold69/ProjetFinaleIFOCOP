import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { User } from '../../shared/models/user.model';
import { PostService } from '../../shared/services/post.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  public postForm: FormGroup;
  public actualPost: Post;
  public idUser: string;
  public userData: User;
  public idPost: string;
  public domaine: string;
  public subscription: Subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.idUser = paramMap.get('_id');
      this.domaine = paramMap.get('_idDomaine');
      this.idPost = paramMap.get('_idPost');
    });

    this.subscription = this.userService.fectchUserSelect(this.idUser).subscribe((user: User) => {
      this.userData = user;
    });

    if (this.idPost !== null) {
      this.subscription = this.postService.getPostOne(this.idPost).subscribe((post) => {
        this.actualPost = post;
      });

      this.postForm = this.fb.group({
        content: [''],
        idUser: [this.idUser],
        nameUser: [''],
        postDate: [Date.now()],
      });
    } else {
      this.postForm = this.fb.group({
        idUser: [this.idUser],
        domaine: [this.domaine],
        title: [''],
        content: [''],
        nameUser: [''],
        postDate: [Date.now()],
        reponse: this.fb.array([]),
      });
    }
  }

  public trySendPost() {
    this.postForm.value.nameUser = this.userData.username;

    this.subscription = this.postService.createPost(this.postForm.value).subscribe(() => {
      this.router.navigate(['homepageUser/post-list'], {
        queryParams: { _idPost: null },
        queryParamsHandling: 'merge',
        preserveFragment: true,
      });
    });
  }

  public trySendAnswer() {
    this.actualPost[0].reponse.push(this.postForm.value);

    this.subscription = this.postService.editPost(this.actualPost[0], this.idPost).subscribe(() => {
      this.router.navigate(['homepageUser/post-list'], {
        queryParams: { _idPost: null },
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
