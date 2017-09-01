'use strict'
function autocomplete (input, latInput, lngInput) {
  if (!input) return
  const dropdown = new google.maps.places.Autocomplete(input)
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace()
    latInput.value = place.geometry.location.lat()
    lngInput.value = place.geometry.location.lng()
  })
  // dont submit the form if someone hit enter of the address field
  input.on('keydown', (e) => {
    if (e.keyCode === 13) e.preventDefault()
  })
}

export default autocomplete
