import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  userServerError='';
  passwordServerError='';
  sessionExpired : boolean = false;

  constructor(private api: ApiService,
              private auth: AuthService,
              private router: Router,
              private fb: FormBuilder
             ) { 
               this.validateLoginForm();
               if(this.router.getCurrentNavigation().extras.state) {
                 this.sessionExpired = this.router.getCurrentNavigation().extras.state.sessionExpired;
               }
             }

   validateLoginForm() {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }   

  ngOnInit() {
    if(this.auth.isLoggedIn()) {
      this.router.navigate(['contacts']);
    }
  }

  onSubmit() {

    const formValues = this.loginForm.value;

    this.userServerError = '';
    this.passwordServerError = '';

    const payload = { 
      username: formValues.username,
      password : formValues.password
    };

    this.api.post('authenticate',payload )
      .subscribe(data => {
        if( data.statusCode == 404 ) {
            this.userServerError = data.error;
            Observable.throwError(data);
        } else if( data.statusCode == 401 ) {
            this.passwordServerError = data.error;
            //Observable.throwError(data);
        } else if( data.statusCode == 422 ) {
            this.userServerError = data.error.username;
            this.passwordServerError = data.error.password;
        } else {
            this.auth.setToken(data.token);
            this.router.navigate(['contacts']);
       }
      });
  }

}
