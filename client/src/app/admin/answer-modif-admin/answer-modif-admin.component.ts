import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-answer-modif-admin',
  templateUrl: './answer-modif-admin.component.html',
  styleUrls: ['./answer-modif-admin.component.css']
})
export class AnswerModifAdminComponent implements OnInit, OnDestroy {
  public postFrom: FormGroup;
  public _id: string;
  public indexAnswer: number;
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
    // get Param
    this.subscription = this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this._id = paramMap.get('target');
      this.indexAnswer = parseInt(paramMap.get('index'), 10);
    });

    // get Post to Modif
    this.subscription = this.postService.getPostOne(this._id).subscribe((data) => {
      this.postModif = data;
      this.postModif = this.postModif[0];
      this.answerModif = this.postModif.reponse[this.indexAnswer];
      this.postFrom = this.fb.group({
        content: this.answerModif.content,
        idUser: this.answerModif.idUser,
      });
    });

  }

  // send Post to Modif
  public trySendPost() {
    if (this.postFrom.value.content === '') {
      this.answerModif.content = this.answerModif.content;
    } else {
      this.answerModif.content = this.postFrom.value.content;
    }
    if (this.postFrom.value.idUser === '') {
      this.answerModif.idUser = this.answerModif.idUser;
    } else {
      this.answerModif.idUser = this.postFrom.value.idUser;
    }
    this.postModif.reponse[this.indexAnswer] = this.answerModif;

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
