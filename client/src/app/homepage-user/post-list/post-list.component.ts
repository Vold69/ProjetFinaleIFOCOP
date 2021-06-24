import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  public _id: string;
  public _idDomaine: string;
  public postDomainePost: Post[];
  public form: FormGroup;
  public subscription: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe(
      (paramMap: ParamMap) => {
        this._id = paramMap.get('_id');
        this._idDomaine = paramMap.get('_idDomaine');
      }
    );

    this.subscription = this.postService
      .getPostSelected(this._id)
      .subscribe((post) => {
        this.postDomainePost = post;
      });
  }

  public sendRep(index: number) {
    this.route.navigate(['/homepageUser/post-create/:_id'], {
      queryParams: { _idPost: this.postDomainePost[index]._id },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  public deleteRep(index: number, indexAnswer: number) {
    this.postDomainePost[index].reponse.splice(indexAnswer, 1);
    const postEdit = this.postDomainePost[index];

    this.subscription = this.postService
      .editPost(postEdit, this.postDomainePost[index]._id)
      .subscribe(() => {});
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
