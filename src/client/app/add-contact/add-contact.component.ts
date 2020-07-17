import { Component, OnInit } from '@angular/core';
import { NgForm ,FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Contact } from '../shared/contact.model';
import { ApiService } from '../shared/api.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {

  loading: Boolean = false;
  newContact: Contact;

  addContactForm: FormGroup;

  firstnameServerError = '';
  lastnameServerError = '';
  addressServerError = '';
  areaCodeServerError = '';
  prefixCodeServerError = '';
  landLineCodeServerError = '';
  photoServerError = '';

  constructor(public api: ApiService,
              private fb: FormBuilder,
              private router: Router
             ) { 
                  this.validateLoginForm();
               }

   validateLoginForm() {
    this.addContactForm = this.fb.group({
      firstName:  ["", Validators.required],
      lastName:   ["", Validators.required],
      address:    ["", Validators.required],
      // areaCode:   ["", Validators.required],
      // prefix:     ["", Validators.required],
      // lineNumber: ["", Validators.required],
      areaCode:   ["", Validators.compose
                        ([
                          Validators.maxLength(5),
                          Validators.required
                        ])
                  ],
      prefix:     ["", Validators.compose
                        ([
                          Validators.maxLength(3),
                          Validators.required
                        ])
                  ],
      lineNumber: ["", Validators.compose
                        ([
                          Validators.maxLength(4),
                          Validators.required
                        ])
                  ],
      photo:      ["", Validators.required]
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;

    const formValues = Object.assign({}, this.addContactForm.value);

    const contact: Contact = {
      firstName : formValues.firstName,
      lastName  : formValues.lastName,
      address   : formValues.address,
      areaCode  : formValues.areaCode,
      prefix    : formValues.prefix,
      lineNumber: formValues.lineNumber,
      photoUrl  : formValues.photo
    };

    this.api.post('/contacts',contact )
      .subscribe(data => {
        if( data.statusCode == 422 ){
          console.log('from add-contact.component.js' + JSON.stringify(data.error));
          this.firstnameServerError = data.error.firstName;
          this.lastnameServerError = data.error.lastName;
          this.addressServerError = data.error.address;
          this.areaCodeServerError = data.error.areaCode;
          this.prefixCodeServerError = data.error.prefix;
          this.landLineCodeServerError= data.error.lineNumber;
          this.photoServerError = data.error.photoUrl;
          this.addContactForm.reset(this.addContactForm.value);
          this.router.navigate(['new']);
        } else {
          this.addContactForm.reset();
          this.loading = false;
          this.newContact = data;
       }
      });
  }

}
