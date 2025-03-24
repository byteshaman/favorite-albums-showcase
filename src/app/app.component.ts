import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import albums from 'src/app/data/albums.json';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatIconModule } from '@angular/material/icon';

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


const mobileBreakpoint = 800;
const CUSTOM_BREAKPOINTS = {
  small: `(width < ${mobileBreakpoint}px)`, // new mq syntax
};

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, MatCheckboxModule, FormsModule, MatIconModule]
})
export class AppComponent {
  albumArray: Album[] = JSON.parse(JSON.stringify(albums));
  filteredArray: Album[] = structuredClone(this.albumArray);

  // used on touch devices to keep track of which albums have been clicked to show the overlay
  clickedAlbums: Set<string> = new Set([]);

  searchInput: string = '';
  chkFG: FormGroup;
  checkboxes: Checkbox[] = [
    { value: 'artist', label: 'Artist' },
    { value: 'title', label: 'Title' },
    { value: 'country', label: 'Country' },
    { value: 'year', label: 'Year' },
    { value: 'genres', label: 'Genre' }
  ];

  isTouchDevice: boolean = 'ontouchstart' in window || navigator.maxTouchPoints > 0; // detect if device is touch-enabled
  // !! operator converts the value to a boolean

  isMobile!: boolean;

  constructor(private formBuilder: FormBuilder, private breakpointObserver: BreakpointObserver) {
    // Detect if the screen size is smaller than the mobile breakpoint and set the isMobile property
    this.breakpointObserver
      .observe([CUSTOM_BREAKPOINTS.small])
      .pipe(takeUntilDestroyed()) // https://medium.com/@chandrashekharsingh25/exploring-the-takeuntildestroyed-operator-in-angular-d7244c24a43e
      .subscribe((result) => {
        console.log('isMobile: ', result.matches)
        this.isMobile = result.matches;
      });

    // Initialize chk
    this.chkFG = this.formBuilder.group({
      artist: [true],
      title: [true],
      country: [true],
      year: [true],
      genres: [true]
    });

    console.log('isTouchDevice: ', this.isTouchDevice);
  }

  allCheckboxesDisabled(): boolean {
    // this.formGroup.value = key/value pair for every control of the form group
    return Object.entries(this.chkFG.value).every(([key, value]) => value === false);
  }

  filterAlbums(): void {
    const st: string = this.searchInput;
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

  /**
   * Check if the album has been clicked 
   * @param {string} url 
   * @returns {boolean} 
   */
  albumClicked(url: string): boolean {
    return this.clickedAlbums.has(url);
  }

  /**
   * Visit the link in a new tab
   * @param {string} url 
   */
  visitLink(url: string): void {
    window.open(url, "_blank");
  }

  onAlbumClick(url: string): void {
    if (this.isTouchDevice) {
      // Toggle the album in the clickedAlbums set
      this.clickedAlbums.has(url) ? this.clickedAlbums.delete(url) : this.clickedAlbums.add(url);
      // console.log('clickedAlbums: ', this.clickedAlbums);
    } else {
      this.visitLink(url);
    }
  }

  onCheckboxChange(): void {
    if (this.allCheckboxesDisabled()) {
      this.restoreCheckboxes(); // Restore all checkboxes if all are disabled
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
