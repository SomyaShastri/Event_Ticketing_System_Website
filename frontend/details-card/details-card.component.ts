import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.css']
})
export class DetailsCardComponent implements OnInit {

  @Input() eventDetails!: any;
  @Input() spotifyDetails!: any
  @Input() venueDetails!: any;
  @Input() coord!: any;
  value!: number;

  isExpanded1: boolean = false;
  isExpanded2: boolean = false;
  isExpanded3: boolean = false;
  showDivGmaps = false;
  // mapOptions!: google.maps.MapOptions 
  // marker !: any;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom: 14
  }
  marker = {
    position: { lat: 38.9987208, lng: -77.2538699 }
  }

  constructor(private modalService: NgbModal) {

  }

  ngOnInit() {
    this.assigncoordinates();
  }

  toggleText1() {
    this.isExpanded1 = !this.isExpanded1;
  }

  toggleText2() {
    this.isExpanded2 = !this.isExpanded2;
  }

  toggleText3() {
    this.isExpanded3 = !this.isExpanded3;
  }

  assigncoordinates() {
    console.log(this.coord);
    this.mapOptions = {
      center: { lat: parseFloat(this.coord.lat), lng: parseFloat(this.coord.lng) },
      zoom: 14
    }
    this.marker = {
      position: { lat: parseFloat(this.coord.lat), lng: parseFloat(this.coord.lng) }
    }
  }

  addToFav(eveDets: any) {
    console.log(eveDets);
    if (typeof (Storage) !== "undefined") {
      if (localStorage.getItem(eveDets.eveId) == null) {
        eveDets.favIcon = "favorite";
        eveDets.color = "red";
        eveDets.classs = "favFilled"
        let eveDetsForFav = { 'date': eveDets.date.split(' ')[0], 'event': eveDets.name, 'category': eveDets.genre, 'venue': eveDets.venue, 'eveid': eveDets.eveId }
        localStorage.setItem(eveDets.eveId, JSON.stringify(eveDetsForFav));
        alert("Event Added to Favorites!");
      } else {
        localStorage.removeItem(eveDets.eveId);
        eveDets.color = "white";
        eveDets.favIcon = "favorite_border";
        eveDets.classs = "favEmpty"
        alert("Removed from Favorites!");
      }
      console.log(localStorage);
    }
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
      },
      (reason) => {
      },
    );
  }
}
