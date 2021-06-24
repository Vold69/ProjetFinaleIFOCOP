import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-post-friend',
  templateUrl: './post-friend.component.html',
  styleUrls: ['./post-friend.component.css'],
})
export class PostFriendComponent implements OnInit, OnDestroy {
  public _id: string;
  public _idDomaine: string;
  public postDomainePostFriend: Post[];
  public postDomainePost: Post[];
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
    if (this._idDomaine !== this._id) {
      this.subscription = this.postService
        .getPostSelected(this._idDomaine)
        .subscribe((post) => {
          this.postDomainePostFriend = post;
        });
    }
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
