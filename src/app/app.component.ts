import { Component } from '@angular/core';
import albums from 'src/app/data/albums.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  albumArray: any[] = JSON.parse(JSON.stringify(albums));

  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
