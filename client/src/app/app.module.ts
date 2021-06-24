// Module Natif
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Component
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { TopbarComponent } from './shared/components/topbar/topbar.component';

// Module
import { LayoutModule } from './shared/layout/layout.module';

// Routing
import { APP_ROUTING } from './app.routing';

// Services
import { AuthService } from './shared/services/auth.service';
import { ProfileComponent } from './profile/profile.component';
import { UserService } from './shared/services/user.service';

// Guards
import { AuthGuard } from './shared/guards/auth.guard';

// Interceptors
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ListUserComponent } from './profile/list-user/list-user.component';
import { FriendRequestComponent } from './profile/friend-request/friend-request.component';
import { HomepageUserComponent } from './homepage-user/homepage-user.component';
import { PostListComponent } from './homepage-user/post-list/post-list.component';
import { PostCreateComponent } from './homepage-user/post-create/post-create.component';
import { FriendConnectComponent } from './homepage-user/friend-connect/friend-connect.component';
import { PostFriendComponent } from './homepage-user/post-friend/post-friend.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { FriendListComponent } from './profile/friend-list/friend-list.component';
import { FriendListTargetComponent } from './profile/friend-list-target/friend-list-target.component';
import { AdminComponent } from './admin/admin.component';
import { AnswerModifAdminComponent } from './admin/answer-modif-admin/answer-modif-admin.component';
import { UserModifAdminComponent } from './admin/user-modif-admin/user-modif-admin.component';
import { PostModifAdminComponent } from './admin/post-modif-admin/post-modif-admin.component';
import { PostListAdminComponent } from './admin/post-list-admin/post-list-admin.component';
import { UserListAdminComponent } from './admin/user-list-admin/user-list-admin.component';
import { SendPostComponent } from './admin/send-post/send-post.component';
import { CreatePostComponent } from './admin/create-post/create-post.component';
import { RegexpModule } from './shared/validator/regexp/regexp.module';
import { AProposComponent } from './homepage/a-propos/a-propos.component';
import { LostPasswordComponent } from './homepage/lost-password/lost-password.component';
import { LookPasswordComponent } from './homepage/look-password/look-password.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { FilterPipe } from './shared/pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SigninComponent,
    SignupComponent,
    TopbarComponent,
    ProfileComponent,
    ListUserComponent,
    FriendRequestComponent,
    HomepageUserComponent,
    PostListComponent,
    PostCreateComponent,
    FriendConnectComponent,
    PostFriendComponent,
    EditProfileComponent,
    FriendListComponent,
    FriendListTargetComponent,
    AdminComponent,
    AnswerModifAdminComponent,
    UserModifAdminComponent,
    PostModifAdminComponent,
    PostListAdminComponent,
    UserListAdminComponent,
    SendPostComponent,
    CreatePostComponent,
    AProposComponent,
    LostPasswordComponent,
    LookPasswordComponent,
    FilterPipe,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    LayoutModule,
    FormsModule,
    RouterModule.forRoot(APP_ROUTING, { onSameUrlNavigation: 'reload'}),
    RegexpModule,
    MaterialFileInputModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true },
    AuthService,
    UserService,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
