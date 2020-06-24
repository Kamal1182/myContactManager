import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

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

    const payload = { 
      username: formValues.username,
      password : formValues.password
    };

    this.api.post('authenticate',payload )
      .subscribe(data => {
        this.auth.setToken(data.token);
        this.router.navigate(['/contacts'])
      });
  }

}
