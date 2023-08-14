import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import albums from 'src/app/data/albums.json';

export interface Album {
  artist: string
  title: string
  displaytitle?: string
  displayartist?: string
  country: string
  year: string
  genres: string
  url: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  albumArray: Album[] = JSON.parse(JSON.stringify(albums));
  filteredArray: Album[] = JSON.parse(JSON.stringify(this.albumArray));
  searchTerm = new FormControl<string>('');

  filterAlbums(): void {
    const st: string = this.searchTerm.value!;
    this.filteredArray = this.albumArray.filter(album => album.artist.toLowerCase().includes(st) || album.displayartist?.toLowerCase().includes(st) || album.title.toLowerCase().includes(st) || album.displaytitle?.toLowerCase().includes(st) || album.country.toLowerCase().includes(st) || album.genres.toLowerCase().includes(st) || album.year.includes(st));
    console.log(this.filteredArray);
  }

  goToLink(url: string): void {
    window.open(url, "_blank");
  }
}
