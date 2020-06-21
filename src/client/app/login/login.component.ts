import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private api: ApiService,
              private auth: AuthService,
              private router: Router
             ) { }

  ngOnInit() {
    if(this.auth.isLoggedIn()) {
      this.router.navigate(['/contacts']);
    }
  }

  onSubmit(loginForm: NgForm) {

    const formValues = loginForm.value;

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
