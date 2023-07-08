/* Inject css */
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/css/bootstrap-grid.css'
// import 'bootstrap/dist/css/bootstrap.css'
import './styles/style.css'
// eslint-disable-next-line no-unused-vars
import { Carousel } from 'bootstrap'

const options = {
  columns: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 3
  },
  lightBox: true,
  lightboxId: 'myAwesomeLightbox',
  showTags: true,
  tagsPosition: 'top',
  navigation: true
}

require('./components/gallery')(options)
