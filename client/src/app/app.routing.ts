import { Route } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FriendRequestComponent } from './profile/friend-request/friend-request.component';
import { HomepageUserComponent } from './homepage-user/homepage-user.component';
import { PostCreateComponent } from './homepage-user/post-create/post-create.component';
import { PostFriendComponent } from './homepage-user/post-friend/post-friend.component';
import { PostListComponent } from './homepage-user/post-list/post-list.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ListUserComponent } from './profile/list-user/list-user.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { FriendListComponent } from './profile/friend-list/friend-list.component';
import { FriendListTargetComponent } from './profile/friend-list-target/friend-list-target.component';
import { AdminComponent } from './admin/admin.component';
import { UserListAdminComponent } from './admin/user-list-admin/user-list-admin.component';
import { PostListAdminComponent } from './admin/post-list-admin/post-list-admin.component';
import { UserModifAdminComponent } from './admin/user-modif-admin/user-modif-admin.component';
import { PostModifAdminComponent } from './admin/post-modif-admin/post-modif-admin.component';
import { AnswerModifAdminComponent } from './admin/answer-modif-admin/answer-modif-admin.component';
import { SendPostComponent } from './admin/send-post/send-post.component';
import { CreatePostComponent } from './admin/create-post/create-post.component';
import { AProposComponent } from './homepage/a-propos/a-propos.component';
import { LookPasswordComponent } from './homepage/look-password/look-password.component';
import { LostPasswordComponent } from './homepage/lost-password/lost-password.component';

export const APP_ROUTING: Route[] = [
  { path: '', component: HomepageComponent },
  { path: 'apropos', component: AProposComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'look-password', component: LookPasswordComponent},
  { path: 'lost-password/:_id', component: LostPasswordComponent},
  { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
  { path: 'list-user', canActivate: [AuthGuard], component: ListUserComponent },
  {
    path: 'friend-request',
    canActivate: [AuthGuard],
    component: FriendRequestComponent,
  },
  {
    path: 'friend-list',
    canActivate: [AuthGuard],
    component: FriendListComponent,
  },
  {
    path: 'friend-list-target',
    canActivate: [AuthGuard],
    component: FriendListTargetComponent,
  },
  {
    path: 'edit-profile',
    canActivate: [AuthGuard],
    component: EditProfileComponent,
  },
  {
    path: 'homepageUser',
    canActivate: [AuthGuard],
    component: HomepageUserComponent,
    children: [
      { path: ':_idDomaine', component: PostListComponent },
      { path: 'post-friend/:_idDomaine', component: PostFriendComponent },
      { path: 'post-create/:_idDomaine', component: PostCreateComponent },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: AdminComponent,
    children: [
      { path: 'user', component: UserListAdminComponent },
      { path: 'post', component: PostListAdminComponent },
      { path: 'user-modif', component: UserModifAdminComponent },
      { path: 'post-modif', component: PostModifAdminComponent },
      { path: 'answer-modif', component: AnswerModifAdminComponent },
      { path: 'send-post', component: SendPostComponent },
      { path: 'create-post', component: CreatePostComponent },
    ],
  },
];
