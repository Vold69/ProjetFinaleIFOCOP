import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public lookPostSelected: BehaviorSubject<Post[]> = new BehaviorSubject(null);
  public lookOnePost: BehaviorSubject<Post> = new BehaviorSubject(null);
  public lookPost: BehaviorSubject<Post[]> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {}

  public getPost: string;
  public postEdit: string;
  public postDelete: string;

  public createPost(post: Post): Observable<Post> {
    return this.http.post<Post>('/api/post/send', post);
  }

  public getPostSelected(idDomaine: string): Observable<Post[]> {
    this.getPost = '/api/post/get/' + idDomaine;

    return this.http.get<Post[]>(this.getPost).pipe(
      tap((data: Post[]) => {
        this.lookPostSelected.next(data);
      }),
      switchMap(() => {
        return this.lookPostSelected;
      })
    );
  }

  public getPostOne(_id: string): Observable<Post> {
    this.getPost = '/api/post/getOne/' + _id;

    return this.http.get<Post>(this.getPost).pipe(
      tap((data: Post) => {
        this.lookOnePost.next(data);
      }),
      switchMap(() => {
        return this.lookOnePost;
      })
    );
  }

  public getAllPost(): Observable<Post[]> {
    return this.http.get<Post[]>('/api/post/getall/').pipe(
      tap((data: Post[]) => {
        this.lookPost.next(data);
      }),
      switchMap(() => {
        return this.lookPost;
      })
    );
  }

  public editPost(post: Post, _id: string): Observable<Post> {
    this.postEdit = '/api/post/edit/' + _id;

    return this.http.post<Post>(this.postEdit, post);
  }

  public editPostAdmin(post: Post, _id: string): Observable<Post> {
    this.postEdit = '/api/post/editAdmin/' + _id;

    return this.http.post<Post>(this.postEdit, post);
  }

  public removePost(_id: string): Observable<Post> {
    this.postDelete = '/api/post/delete/' + _id;

    return this.http.delete<Post>(this.postDelete);
  }
}
