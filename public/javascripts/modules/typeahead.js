import axios from 'axios'
import dompurify from 'dompurify'

function searchResultHTML (stores) {
  return stores.map(store => {
    return `
      <a href="/stores/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>
    `
  }).join('')
}
function typeAhead (search) {
  if (!search) return false

  const searchInput = search.querySelector('input[name="search"]')
  const searchResults = search.querySelector('.search__results')

  searchInput.on('input', function search () {
    if (!this.value) {
      searchResults.style.display = 'none'
      return false
    }
    searchResults.style.display = 'block'
    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = dompurify.sanitize(searchResultHTML(res.data))
          return true
        }
        searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No result for ${this.value} found!</div>`)
      })
      .catch(err => console.log(err))
  })

  searchInput.on('keyup', (e) => {
    if (![38, 40, 13].includes(e.keyCode)) return false
    const activeClass = 'search__result--active'
    const current = search.querySelector(`.${activeClass}`)
    const items = search.querySelectorAll('.search__result')
    let next
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0]
    } else if (e.keyCode === 40) {
      next = items[0]
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1]
    } else if (e.keyCode === 38) {
      next = items[items.length - 1]
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href
      return false
    }
    if (current) {
      current.classList.remove(activeClass)
    }
    next.classList.add(activeClass)
  })
}

export default typeAhead
