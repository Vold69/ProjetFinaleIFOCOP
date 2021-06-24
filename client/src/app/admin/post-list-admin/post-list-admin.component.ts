import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-post-list-admin',
  templateUrl: './post-list-admin.component.html',
  styleUrls: ['./post-list-admin.component.css'],
})
export class PostListAdminComponent implements OnInit, OnDestroy {
  public subscription: Subscription = new Subscription();
  public allPost: Post[];

  constructor(
    private postService: PostService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.postService.getAllPost().subscribe((post) => {
      this.allPost = post;
    });
  }

  public upAnswer(index: number) {
    this.route.navigate(['/admin/send-post'], {
      relativeTo: this.activatedRoute,
      queryParams: { target: this.allPost[index]._id },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  public modifPost(index: number) {
    this.route.navigate(['/admin/post-modif'], {
      relativeTo: this.activatedRoute,
      queryParams: { target: this.allPost[index]._id },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  public modifAnswer(index: number, indexAnswer: number) {
    this.route.navigate(['/admin/answer-modif'], {
      relativeTo: this.activatedRoute,
      queryParams: { target: this.allPost[index]._id, index: indexAnswer },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  public deletePost(index: number) {
    this.subscription = this.postService
      .removePost(this.allPost[index]._id)
      .subscribe(() => {
        this.subscription = this.postService.getAllPost().subscribe((post) => {
          this.allPost = post;
        });
      });
  }

  public deleteAnswer(index: number, indexAnswer: number) {
    this.allPost[index].reponse.splice(indexAnswer, 1);
    this.subscription = this.postService
      .editPost(this.allPost[index], this.allPost[index]._id)
      .subscribe(() => {
        this.subscription = this.postService.getAllPost().subscribe((post) => {
          this.allPost = post;
        });
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
