import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { PostService } from '../../shared/services/post.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit, OnDestroy {
  public idTarget: string;
  public idAdmin: string;
  public target: User;
  public postForm: FormGroup;
  public subscription: Subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.idTarget = paramMap.get('target');
      this.idAdmin = paramMap.get('_id');
    });

    this.subscription = this.userService
      .fectchUserSelect(this.idTarget)
      .subscribe((user: User) => {
        this.target = user;
      });

    this.postForm = this.fb.group({
      title: [],
      content: [],
      domaine: [this.idTarget],
      idUser: [this.idAdmin],
      nameUser: 'Admin',
      postDate: [Date.now()],
      reponse: this.fb.array([]),
    });
  }

  public trySend() {
    this.subscription = this.postService.createPost(this.postForm.value).subscribe(() => {
      this.router.navigate(['/admin/user'], {
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
