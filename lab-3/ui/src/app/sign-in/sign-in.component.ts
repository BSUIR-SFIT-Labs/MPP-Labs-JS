import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityDto } from '../shared/dtos/identityDto';
import { IdentityService } from '../shared/services/identity.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;

  constructor(
    private identityService: IdentityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createSignInForm();
  }

  onSubmit() {
    const signInDto = new IdentityDto();
    signInDto.email = this.signInForm.value.email;
    signInDto.password = this.signInForm.value.password;

    this.identityService.signIn(signInDto).subscribe(
      () => {
        this.router.navigateByUrl('/');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private createSignInForm() {
    this.signInForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
}
