import { Component } from '@angular/core';
import { Event,
         NavigationStart,
         NavigationEnd,
         NavigationCancel,
         NavigationError,
         Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';

  constructor(private _loadingBar: SlimLoadingBarService,
              private _router: Router) {
                this._router.events.subscribe((event: Event) => {
                  this.navigationInterceptor(event);
               })
  }

  navigationInterceptor(event: Event) {
    if(event instanceof NavigationStart)
      this._loadingBar.start();
    else if(event instanceof NavigationEnd)
      this._loadingBar.complete();
    else if(event instanceof NavigationCancel)
    this._loadingBar.stop();
    else if(event instanceof NavigationError)
    this._loadingBar.stop();
  }
}
