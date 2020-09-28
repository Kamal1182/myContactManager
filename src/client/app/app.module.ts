import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactComponent } from './contact/contact.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { LoginComponent } from './login/login.component';
import { ApiService } from './shared/api.service';
import { AuthService } from './shared/auth.service';
import { AuthGuard } from './auth.guard';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteContactModalComponent } from './delete-contact-modal/delete-contact-modal.component';
import { AddContactModalComponent } from './add-contact-modal/add-contact-modal.component';
import { EditContactModalComponent } from './edit-contact-modal/edit-contact-modal.component'

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ContactListComponent,
    ContactComponent,
    AddContactComponent,
    LoginComponent,
    DeleteContactModalComponent,
    AddContactModalComponent,
    EditContactModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    SlimLoadingBarModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgbModule
  ],
  providers: [ApiService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
