import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-send-post',
  templateUrl: './send-post.component.html',
  styleUrls: ['./send-post.component.css'],
})
export class SendPostComponent implements OnInit, OnDestroy {
  public postFrom: FormGroup;
  public target: string;
  public _id: string;
  public postModif: Post;
  public answerModif: any;
  public subscription: Subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.target = paramMap.get('target');
      this._id = paramMap.get('_id');
    });

    this.subscription = this.postService.getPostOne(this.target).subscribe((data) => {
      this.postModif = data;
      this.postModif = this.postModif[0];
    });

    this.postFrom = this.fb.group({
      content: [''],
      idUser: [this._id],
      postDate: [Date.now()],
    });
  }

  public trySendPost() {
    this.postModif.reponse.push(this.postFrom.value);

    this.subscription = this.postService
      .editPostAdmin(this.postModif, this.postModif._id)
      .subscribe(() => {
        this.route.navigate(['/admin'], {
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
