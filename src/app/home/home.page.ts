import { Component } from '@angular/core';
import { GoogleMaps, GoogleMap, Environment, GoogleMapsMapTypeId, GoogleMapOptions, MyLocation, Marker, GoogleMapsAnimation, GoogleMapsEvent } from '@ionic-native/google-maps/ngx'; 
import { Platform, ToastController, MenuController } from '@ionic/angular';
import {mapStyle} from './mapStyle';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
map:GoogleMap;
noturno = false;
  constructor(private platform:Platform,
    public toastCtrl:ToastController,
    private menu: MenuController) {}
async ngOnInit() {
  await this.platform.ready();
  await this.loadMap();
}


async loadMap() {

  Environment.setEnv({
    'API_KEY_FOR_BROWSER_DEBUG':'AIzaSyAKobm-HSMyLWMgEc9JtvS3kpDayjNu2vY',
    'API_KEY_FOR_BROWSER_RELEASE':'AIzaSyAKobm-HSMyLWMgEc9JtvS3kpDayjNu2vY'
   });

  let lStyle = []
  if (this.noturno === true || this.isNight()) {
    debugger;
    lStyle = mapStyle
  }
  let stdStyle = [
    {
      "featureType": "all",
      "stylers": [
        { "color": "#C0C0C0" }
      ]
    }, {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        { "color": "#f8f8f8" }
      ]
    }, {
      "featureType": "landscape",
      "elementType": "labels",
      "stylers": [
        { "visibility": "on" }
      ]
    }
  ]

  let options: GoogleMapOptions = {
    mapType: GoogleMapsMapTypeId.NORMAL,
    disableDefaultUI: true,
    // controls: {
    //   'compass': true,
    //   'myLocationButton': true,
    //   'myLocation': true,   // (blue dot)
    //   'indoorPicker': true,
    //   'zoom': true,          // android only
    //   'mapToolbar': true     // android only
    // },    
    gestures: {
      scroll: true,
      tilt: true,
      zoom: true,
      rotate: true
    },
    styles: lStyle, // https://developers.google.com/maps/documentation/javascript/style-reference    
    camera: {
      target: [
        { lat: -3.7589989, lng: -38.4744683 },
        { lat: -3.7589999, lng: -38.4744689 },
        { lat: -3.7592222, lng: -38.4745555 }
      ]
    },
    preferences: {
      zoom: {
        minZoom: 12,
        maxZoom: 19
      },
      padding: {
        left: 10,
        top: 10,
        bottom: 10,
        right: 10
      },
      building: true
    }
  };
  //this.map = GoogleMaps.create('map_canvas',options) 
  this.map = GoogleMaps.create('map_canvas', {
    mapType: GoogleMapsMapTypeId.NORMAL,
    controls: {
      'compass': false,
      'myLocationButton': false,
      'myLocation': true,   // (blue dot)
      'indoorPicker': true,
      'zoom': false,          // android only
      'mapToolbar': false,    // android only
      'zoomControl': false
    },
    gestures: {
      scroll: true,
      tilt: true,
      zoom: true,
      rotate: true
    },
    preferences: {
      zoom: {
        minZoom: 15,
        maxZoom: 18
      },

      padding: {
        left: 20,
        top: 40,
        bottom: 30,
        right: 20
      },

      building: true
    },
    camera: {
      target: {
        lat: 43.0741704,
        lng: -89.3809802
      },
      zoom: 18,
      tilt: 30
    },
    styles: lStyle

  });
  this.gotoMyLocation();
}

gotoMyLocation() {
  this.map.clear();

  //get the location of you
  this.map.getMyLocation().then((location: MyLocation) => {
    console.log(JSON.stringify(location, null, 2));

    // Move the map camera to the location with animation
    this.map.animateCamera({
      target: location.latLng,
      zoom: 17,
      duration: 5000
    });
    //add marker
    let marker: Marker = this.map.addMarkerSync({
      title: 'Você está aqui!',
      snippet: 'Estamos te vendo.',
      position: location.latLng,
      animation: GoogleMapsAnimation.BOUNCE
    });
    //show the infowindow
    //marker.showInfoWindow();

    // if cliecked it, display the alert
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      this.noturno = !this.noturno;
      this.showToast('Modo noturno ' + ((this.noturno || this.isNight()) ? 'Ativado' : 'desativado') + '!');
      let sty = [];
      if (this.noturno || this.isNight()) {
        sty = mapStyle;
      }
      this.map.setOptions({
        styles: sty
      });
    });

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
      (data) => {
        console.log("Click Map", data);
      }
    );

  })
    .catch(err => {
      // this. loading.dismiss()
      this.showToast(err.error_message);
    });
}

async showToast(message: string) {
  let toast = await this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: 'middle'
  });
  toast.present();
}

isNight() {
  //Returns true if the time is between
  //7pm to 5am
  let time = new Date().getHours();
  return (time > 5 && time < 19) ? false : true;
}
public onButtonClick(b){
  //this.loadMap();
  if (!this.menu.isOpen) {
    this.menu.open;
  }
  this.menu.open()
}
public abreMenu(d){
  this.menu.open();
}
}
