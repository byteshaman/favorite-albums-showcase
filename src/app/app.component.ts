import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import albums from 'src/app/data/albums.json';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgFor, NgIf } from '@angular/common';

interface Album {
  artist: string;
  title: string;
  displaytitle?: string;
  displayartist?: string;
  extra?: string;
  country: string;
  year: string;
  genres: string;
  url: string;
}

interface Checkbox {
  value: string;
  label: string;
}


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [ReactiveFormsModule, NgFor, MatCheckboxModule, NgIf]
})
export class AppComponent {
  albumArray: Album[] = JSON.parse(JSON.stringify(albums));
  filteredArray: Album[] = JSON.parse(JSON.stringify(this.albumArray));
  searchTerm = new FormControl<string>('');
  chkFG: FormGroup;
  checkboxes: Checkbox[] = [
    { value: 'artist', label: 'Artist' },
    { value: 'title', label: 'Title' },
    { value: 'country', label: 'Country' },
    { value: 'year', label: 'Year' },
    { value: 'genres', label: 'Genre' }
  ];

  constructor(private formBuilder: FormBuilder)  {
    this.chkFG = this.formBuilder.group({
      artist: [true],
      title: [true],
      country: [true],
      year: [true],
      genres: [true]
    });
  }

  allCheckboxesDisabled(): boolean {
    // this.formGroup.value = key/value pair for every control of the form group
    return Object.entries(this.chkFG.value).every(([key, value]) => value === false);
  }

  filterAlbums(): void {
    const st: string = this.searchTerm.value!;
    try {

      this.filteredArray = this.albumArray
        .filter(album => (album.year.includes(st) && this.chkFG.get('year')?.value)
          || ((album.artist.toLowerCase().includes(st) || album.displayartist?.toLowerCase().includes(st)) && this.chkFG.get('artist')?.value)
          || ((album.title.toLowerCase().includes(st) || album.displaytitle?.toLowerCase().includes(st)) && this.chkFG.get('album')?.value)
          || (album.country.toLowerCase().includes(st) && this.chkFG.get('country')?.value)
          || (album.genres.toLowerCase().includes(st) && this.chkFG.get('genres')?.value)
        );
    } catch (error) {
      debugger;
    }
    // console.log(this.filteredArray);
  }

  goToLink(url: string): void {
    window.open(url, "_blank");
  }

  onCheckboxChange(): void {
    if (this.allCheckboxesDisabled()) {
      this.restoreCheckboxes();
    }
    this.filterAlbums();
  }

  restoreCheckboxes(): void {
    this.chkFG.patchValue({
      artist: true,
      title: true,
      country: true,
      year: true,
      genres: true
    });
  }
}
