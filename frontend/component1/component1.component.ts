import { Component, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { debounceTime, tap, switchMap, distinctUntilChanged, filter } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html',
  styleUrls: ['./component1.component.css']
})
export class Component1Component {
  selectedValue: string = "default";
  latitude: any = "";
  longitude: any = "";
  textboxDisabled = false;
  showEverythingElse = true;
  displayErrorTable = false;
  @ViewChild('myForm') myForm!: NgForm;


  searchKeywordCtrl = new FormControl();
  filteredKeyword: any;
  isLoading = false;
  errorMsg!: string;
  selectedKeyword: any = '';

  tableData: any[] = [];
  eventData: any;
  spotifyData: any;
  venueData: any;
  coordinates: any;

  displayedColumns = ['date', 'imgurl', 'evename', 'genre', 'venue'];

  hostname = 'https://eco-byte-377504.wl.r.appspot.com/';
  //hostname = 'http://127.0.0.1:8081/';
  displayEveTable = false;
  displayDetCard = false;
  textboxValue = '';
  locationCheckBox: boolean = false;

  constructor(private http: HttpClient) { }

  onSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedKeyword = event.option.value.name;
  }

  displayWith(value: any) {
    return value;
  }

  ngOnInit() {
    this.searchKeywordCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= 1
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredKeyword = [];
          this.isLoading = true;
        }),
        switchMap(value => firstValueFrom(this.http.get(this.hostname + 'autocomplete?keyword=' + encodeURIComponent(value)))
          .then((response: any) => {
            this.isLoading = false;
            if ((response._embedded) && 'attractions' in response._embedded)
              return response._embedded.attractions;
          })
          .catch((error: any) => {
            this.isLoading = false;
            throw error;
          })
        ))
      .subscribe((data: any) => {
        if (data == undefined) {
          this.errorMsg = data['Error'];
          this.filteredKeyword = [];
        } else {
          this.errorMsg = "";
          this.filteredKeyword = data;
        }
      });
  }

  onCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.textboxDisabled = target.checked;
    if (target.checked) {
      this.textboxValue = '';
    }
  }

  async getIpInfo() {
    const apiUrl = 'https://ipinfo.io/?token=<token>'
    const response: any = await firstValueFrom(this.http.get(apiUrl))
    const { loc } = response;
    [this.latitude, this.longitude] = loc.split(',');
  }

  async getLocation(locationTextBox: string) {
    var apiKey = "<Apikey>";
    const apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(locationTextBox) + "&key=" + apiKey;
    console.log(apiUrl);
    const response: any = await firstValueFrom(this.http.get(apiUrl))
    var latlong = response['results'][0]['geometry']['location'];
    this.latitude = latlong['lat'];
    this.longitude = latlong['lng'];
  }

  async formValidation(form: NgForm) {
    const nameInput = document.getElementById('keywordName') as HTMLInputElement;
    if (nameInput.checkValidity() === false) {
      nameInput.reportValidity();
      return;
    }

    const textboxInput = document.getElementById('locationTextBox') as HTMLInputElement;
    const checkboxInput = document.getElementById('locationCheckBox') as HTMLInputElement;
    if (!(checkboxInput.checked) && (textboxInput.checkValidity() === false)) {
      textboxInput.reportValidity();
      return;
    }

    this.showEverythingElse = true;
    let { keyword, distance, locationTextBox, locationCheckBox, category } = form.value;
    keyword = this.selectedKeyword;
    if (form.valid) {
      if (distance == "") {
        distance = 10;
      }
      let segmentId = "";
      switch (category) {
        case "music":
          segmentId = "KZFzniwnSyZfZ7v7nJ";
          break;
        case "sports":
          segmentId = "KZFzniwnSyZfZ7v7nE";
          break;
        case "arts":
          segmentId = "KZFzniwnSyZfZ7v7na";
          break;
        case "film":
          segmentId = "KZFzniwnSyZfZ7v7nn";
          break;
        case "miscellaneous":
          segmentId = "KZFzniwnSyZfZ7v7n1";
          break;
        case "default":
          segmentId = "";
      }
      console.log(keyword);
      console.log(distance);
      console.log(locationTextBox);
      console.log(locationCheckBox);
      console.log(category);
      if (locationCheckBox) {
        await this.getIpInfo();
      } else {
        await this.getLocation(locationTextBox);
      }
      await this.api1(keyword, distance, segmentId);
    }
  }

  api1(keyword: string, distance: number, segmentId: string) {
    this.displayDetCard = false;
    let apiUrl = this.hostname + 'all_events?keyword=' + encodeURIComponent(keyword) + '&radius=' + distance + '&segmentId=' + segmentId + '&latitude=' + this.latitude + '&longitude=' + this.longitude;
    console.log(apiUrl);
    this.http.get(apiUrl).subscribe((response: any) => {
      this.tableData = response;
      if (!(this.tableData.hasOwnProperty('error'))) {
        this.sortTable();
        this.displayEveTable = true;
        this.displayErrorTable = false;
      }
      else {
        this.displayEveTable = false;
        this.displayErrorTable = true;
      }
    });
  }

  async api2(selEventId: string) {
    let artistname: any;
    let locName: any;
    let categ: any;
    let apiUrl = this.hostname + 'event_details?eveid=' + selEventId;
    console.log(apiUrl);
    this.eventData = await firstValueFrom(this.http.get(apiUrl));
    console.log(this.eventData);
    artistname = this.eventData.name;
    locName = this.eventData.venue;
    categ = this.eventData.genre;
    if (localStorage.getItem(selEventId)) {
      this.eventData.color = "red";
      this.eventData.favIcon = "favorite";
      this.eventData.classs = "favFilled"

    }
    else {
      this.eventData.color = "white";
      this.eventData.favIcon = "favorite_border";
      this.eventData.classs = "favEmpty"
    }

    console.log(artistname);
    console.log(categ);
    if (artistname && categ.includes("Music")) {
      let apiUrl2 = this.hostname + 'spotify_details?artistName=' + encodeURIComponent(artistname);
      console.log(apiUrl2);
      this.spotifyData = await firstValueFrom(this.http.get(apiUrl2));
    }
    else {
      this.spotifyData = [];
    }
    let locationAdd: any;
    let apiUrl3 = this.hostname + 'venue_details?keyword=' + encodeURIComponent(locName);
    this.venueData = await firstValueFrom(this.http.get(apiUrl3));
    locationAdd = this.venueData.addgmap;
    console.log(locationAdd);
    const gmapcoord = await this.googleMapCoordFetch(locationAdd);
    this.center.lat = gmapcoord['results'][0]['geometry']['location']['lat'];
    this.center.lng = gmapcoord['results'][0]['geometry']['location']['lng'];
    console.log(this.center);
    this.displayEveTable = false;
    this.displayDetCard = true;
    this.displayErrorTable = false;
  }

  center = { lat: 0, lng: 0 };

  googleMapCoordFetch(add: string): Promise<any> {
    var apiKey = "<key>";
    const apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(add) + "&key=" + apiKey;
    console.log(apiUrl);
    return firstValueFrom(this.http.get(apiUrl));
  }

  goBack() {
    this.displayErrorTable = false;
    this.displayEveTable = true;
    this.displayDetCard = false;
  }

  sortTable() {
    //    sortTable(columnName: string) {
    let sortDirection = 'asc';
    // if (this.sortColumn === columnName) {
    //   this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    // } else {
    //   this.sortColumn = columnName;
    //   this.sortDirection = 'asc';
    // }
    let columnName = 'date';
    this.tableData.sort((a, b) => {
      if (a[columnName] < b[columnName]) {
        return sortDirection === 'asc' ? -1 : 1;
      } else if (a[columnName] > b[columnName]) {
        return sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  clearForm() {
    this.showEverythingElse = false;
    this.selectedValue = 'default';
    this.selectedKeyword = '';
    this.myForm.form.value.distance = '10';
    this.textboxDisabled = false;
    this.textboxValue = '';
    this.locationCheckBox = false;
  }

}

