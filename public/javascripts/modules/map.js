import axios from 'axios'
import { $ } from '../modules/bling'
const mapOptions = {
  center: { lat: 43.2, lng: -79.8 },
  zoom: 10
}

function loadPlaces (map, lat = 43.2, lng = -79.8) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
    .then(res => {
      const places = res.data
      if (!places.length) {
        return alert('No pleces found!')
      }
      //  create a bounds
      const bounds = new google.maps.LatLngBounds()

      const infoWindow = new google.maps.InfoWindow()
      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates
        const position = { lat: placeLat, lng: placeLng }
        bounds.extend(position)
        const marker = new google.maps.Marker({ map, position })
        marker.place = place
        return marker
      })

      // Show details of a place when a marker is clicked
      markers.forEach(marker => marker.addListener('click', function () {
        const html = `
          <div class="popup">
            <a href="/stores/${this.place.slug}">
              <img src="/uploads/${this.place.photo || 'store.png'}" alt="this.place.name" />
              <p>${this.place.name} - ${this.place.location.address}</p>
            </a>
          </div>
        `
        infoWindow.setContent(html)
        infoWindow.open(map, this)
      }))
      // zoom the map to fit all the markers parfectly
      map.setCenter(bounds.getCenter())
      map.fitBounds(bounds)
    })
}

function makeMap (mapDiv) {
  if (!mapDiv) return false
  const map = new google.maps.Map(mapDiv, mapOptions)
  const input = $('[name="geolocate"]')
  loadPlaces(map)
  const autocomplete = new google.maps.places.Autocomplete(input)
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng())
  })
}

export default makeMap
