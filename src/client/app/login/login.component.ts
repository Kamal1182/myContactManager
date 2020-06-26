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
  userError='';
  passwordError='';

  constructor(private api: ApiService,
              private auth: AuthService,
              private router: Router,
              private fb: FormBuilder
             ) { 
               this.validateLoginForm();
             }

   validateLoginForm() {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }   

  ngOnInit() {
    if(this.auth.isLoggedIn()) {
      this.router.navigate(['/contacts']);
    }
  }

  onSubmit() {

    const formValues = this.loginForm.value;

    this.userError = '';
    this.passwordError = '';

    const payload = { 
      username: formValues.username,
      password : formValues.password
    };

    this.api.post('authenticate',payload )
      .subscribe(data => {
        if( data.statusCode == 404 ) {
            this.userError = data.error;
            Observable.throwError(data);
        } else if( data.statusCode == 401 ) {
            this.passwordError = data.error;
        } else if( data.statusCode == 200 ){
            this.auth.setToken(data.token);
            this.router.navigate(['/contacts']);
       }
      });
  }

}
