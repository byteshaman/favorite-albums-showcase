import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import albums from 'src/app/data/albums.json';

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
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  albumArray: Album[] = JSON.parse(JSON.stringify(albums));
  filteredArray: Album[] = JSON.parse(JSON.stringify(this.albumArray));
  searchTerm = new FormControl<string>('');
  formGroup: FormGroup;
  checkboxes: Checkbox[];

  constructor(private formBuilder: FormBuilder)  {
    this.formGroup = this.formBuilder.group({
      artist: [true],
      title: [true],
      country: [true],
      year: [true],
      genres: [true]
    });

    this.checkboxes = [
      {value: 'artist', label: 'Artist'},
      {value: 'title', label: 'Title'},
      {value: 'country', label: 'Country'},
      {value: 'year', label: 'Year'},
      {value: 'genres', label: 'Genre'}
    ]
  }

  allCheckboxesDisabled(): boolean {
    // this.formGroup.value = key/value pair for every control of the form group
    return Object.entries(this.formGroup.value).every(([key, value]) => value === false);
  }

  filterAlbums(): void {
    const st: string = this.searchTerm.value!;
    this.filteredArray = this.albumArray
      .filter(album => false // pointless, just to align stuff
        || ((album.artist.toLowerCase().includes(st) || album.displayartist?.toLowerCase().includes(st)) && this.formGroup.get('artist')?.value) 
        || ((album.title.toLowerCase().includes(st) || album.displaytitle?.toLowerCase().includes(st)) && this.formGroup.get('album')?.value)
        || (album.country.toLowerCase().includes(st) && this.formGroup.get('country')?.value)
        || (album.genres.toLowerCase().includes(st) && this.formGroup.get('genres')?.value)
        || (album.year.toLowerCase().includes(st) && this.formGroup.get('year')?.value)
      );
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
    this.formGroup.patchValue({
      artist: true,
      title: true,
      country: true,
      year: true,
      genres: true
    });
  }
}
