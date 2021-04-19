import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IdentityGuard } from './shared/guards/identity.guard';
import { TodoGuard } from './shared/guards/todo.guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canLoad: [TodoGuard],
    canActivate: [TodoGuard],
  },
  { path: 'sign-up', component: SignUpComponent, canActivate: [IdentityGuard] },
  { path: 'sign-in', component: SignInComponent, canActivate: [IdentityGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
