import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-post-modif-admin',
  templateUrl: './post-modif-admin.component.html',
  styleUrls: ['./post-modif-admin.component.css'],
})
export class PostModifAdminComponent implements OnInit, OnDestroy {
  public postFrom: FormGroup;
  public _id: string;
  public postModif: Post;
  public subscription: Subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this._id = paramMap.get('target');
    });

    this.subscription = this.postService.getPostOne(this._id).subscribe((data) => {
      this.postModif = data;
      this.postModif = this.postModif[0];

      this.postFrom = this.fb.group({
        title: this.postModif.title,
        content: this.postModif.content,
        domaine: this.postModif.domaine,
        idUser: this.postModif.idUser,
      });
    });
  }

  public trySendPost() {
    if (this.postFrom.value.title === '') {
      this.postModif.title = this.postModif.title;
    } else {
      this.postModif.title = this.postFrom.value.title;
    }
    if (this.postFrom.value.content === '') {
      this.postModif.content = this.postModif.content;
    } else {
      this.postModif.content = this.postFrom.value.content;
    }
    if (this.postFrom.value.domaine === '') {
      this.postModif.domaine = this.postModif.domaine;
    } else {
      this.postModif.domaine = this.postFrom.value.domaine;
    }
    if (this.postFrom.value.idUser === '') {
      this.postModif.idUser = this.postModif.idUser;
    } else {
      this.postModif.idUser = this.postFrom.value.idUser;
    }
    this.postService
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
