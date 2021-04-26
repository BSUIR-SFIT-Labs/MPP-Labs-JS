import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityDto } from '../shared/dtos/identityDto';
import { IdentityService } from '../shared/services/identity.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(
    private identityService: IdentityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createSignUpForm();
  }

  onSubmit() {
    const signUpDto = new IdentityDto();
    signUpDto.email = this.signUpForm.value.email;
    signUpDto.password = this.signUpForm.value.password;

    this.identityService.signUp(signUpDto).subscribe(
      () => {
        this.router.navigateByUrl('/sign-in');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private createSignUpForm() {
    this.signUpForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
}
