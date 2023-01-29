import L, { LeafletMouseEventHandlerFn } from 'leaflet';
import standardMarker from '../../public/img/standard-marker.png';
import userMarker from '../../public/img/user-marker.png';
import type { Article } from '../model/article';


export class Map {

    private map!: L.Map;
    private markers: L.Marker[] = [];
    private markersId: number[] = []; // keeps track of articles id's and markers index
    private userMarker!: L.Marker;

    private placeHolderMarker!: L.Marker;
    private mapZoom: number = 14;

    private standardMarkerIcon = L.icon({
        iconUrl: standardMarker,
        iconAnchor: [15, 45],
    });

    private userMarkerIcon = L.icon({
        iconUrl: userMarker,
        className: 'user-marker-animation',
    });

    initMap(coords: number[]) {
        this.map = this.loadMap(coords);
        this.userMarker = this.displayUserMarker(coords);
        this.moveToLocation(coords);
    }


    addClickListener(callback : LeafletMouseEventHandlerFn) {
        this.map.on('click', callback);
    }

    moveToLocation([lat, lng]: number[]) {
        this.map.setView([lat, lng], this.mapZoom, {
            animate: true,
            duration: 1,
        });
    }

    moveUserMarker([lat, lng]: number[]) {
        this.userMarker.setLatLng([lat, lng]);
    }

    addMarker(article: Article) {
        const [lat, lng] = article.coordinates;
        const marker = L.marker([lat, lng], { icon: this.standardMarkerIcon })
            .addTo(this.map)
            .bindPopup(`<div class="popup-content">
                                    <img src="${article.icon.url}">
                                    <span>${article.title}</span>
                                    <button class="btn marker-btn" data-id="${article.id}"><i class="fa-solid fa-arrow-right"></i></button>
                                </div> `,
                { autoClose: true, closeOnClick: true, autoPan: false})
            .openPopup();
        if (article.id != null) {
            this.markersId.push(article.id);
        }
        this.markers.push(marker);
    }




    removeMarker(id: number) {
        const index = this.markersId.indexOf(id);
        this.markers[index].remove();
        this.markers.splice(index, 1);
        this.markersId.splice(index, 1);
    }

    openMarkerPopup(id: number) {
        const index = this.markersId.indexOf(id);
        console.log(index);
        this.markers[index].openPopup();
    }

    addPlaceHolderMarker([lat, lng]: number[]) {
        this.removePlaceHolderMarker()
        this.placeHolderMarker = L.marker([lat, lng], {icon: this.standardMarkerIcon})
            .addTo(this.map)
            .openPopup();
    };

    removePlaceHolderMarker() {
        if (this.placeHolderMarker != null) this.placeHolderMarker.remove();
    }

    closeAllPopups() {
        this.markers.forEach((marker) => {
            marker.closePopup();
        });
    }

    loadMap([lat, lng]: number[]) {
        console.log(lat, lng);
        const tempMap = L.map('map', { center: [lat, lng], }
            ).setView([lat, lng], this.mapZoom);

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(tempMap);

        return tempMap;
    }

    displayUserMarker([lat, lng]: number[]) {
        if (this.userMarker) {
            this.userMarker.remove();
        }
        return L.marker([lat, lng], { icon: this.userMarkerIcon }).addTo(this.map);
    }
}
