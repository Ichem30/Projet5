const { Modal } = require('bootstrap')
const gallery = document.querySelector('.gallery')
const galleryItems = document.querySelectorAll('.gallery-item')

const createRowWrapper = element => {
  if (!element.firstElementChild.classList.contains('row')) {
    element.insertAdjacentHTML('beforeend', '<div class="gallery-items-row row"></div>')
  }
}

const createLightBox = (gallery, lightboxId, navigation) => {
  gallery.insertAdjacentHTML('beforeend', `<div class="modal fade" id="${lightboxId || 'galleryLightbox'
    }" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        ${navigation
      ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
      : '<span style="display:none;" />'
    }
                        <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                        ${navigation
      ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
      : '<span style="display:none;" />'
    }
                    </div>
                </div>
            </div>
        </div>`)
}

const openLightBox = (element, lightboxId) => {
  const lightbox = document.getElementById(lightboxId)
  const lightBoxImage = document.querySelector('.lightboxImage')

  lightBoxImage.src = element.src
  const modal = new Modal(lightbox)
  modal.show()
}

const filterByTag = element => {
  const galleryItemsRow = document.querySelector('.gallery-items-row')

  if (element.classList.contains('active-tag')) {
    return
  }

  galleryItemsRow.style.opacity = 0
  galleryItemsRow.style.width = '0%'
  galleryItemsRow.style.display = 'none'

  const activeTag = document.querySelector('.active-tag')
  activeTag.classList.remove('active')
  activeTag.classList.remove('active-tag')
  element.classList.add('active-tag')

  // https://developer.mozilla.org/fr/docs/Learn/HTML/Howto/Use_data_attributes
  const tag = element.dataset.imagesToggle

  galleryItems.forEach(item => {
    item.parentNode.style.display = 'none'

    if (tag === 'all') {
      item.parentNode.style.display = 'block'
    } else if (item.dataset.galleryTag === tag) {
      item.parentNode.style.display = 'block'
    }
  })
  galleryItemsRow.style.display = 'flex'
  window.setTimeout(() => {
    galleryItemsRow.style.opacity = 1
    galleryItemsRow.style.width = '100%'
  }, 300)
}

const getActiveImage = () => {
  const lightboxImage = document.querySelector('.lightboxImage')
  let activeImage = null
  galleryItems.forEach(item => {
    if (item.src === lightboxImage.src) {
      activeImage = item
    }
  })
  return activeImage
}

const getImagesCollection = () => {
  const itemColumns = document.querySelectorAll('.item-column')
  const activeTagElement = document.querySelector('.tags-bar span.active-tag')
  const activeTag = activeTagElement.dataset.imagesToggle
  const imagesCollection = []
  if (activeTag === 'all') {
    itemColumns.forEach(item => {
      if (item.children.length) {
        imagesCollection.push(item.firstElementChild)
      }
    })
  } else {
    itemColumns.forEach(item => {
      if (item.firstElementChild.dataset.galleryTag === activeTag) {
        imagesCollection.push(item.firstElementChild)
      }
    })
  }
  return imagesCollection
}

const prevImage = () => {
  const lightboxImage = document.querySelector('.lightboxImage')
  const activeImage = getActiveImage()
  const imagesCollection = getImagesCollection()
  let index = 0
  let next = null

  imagesCollection.forEach((item, i) => {
    if (activeImage.getAttribute('src') === item.getAttribute('src')) {
      index = i - 1
    }
  })
  next = imagesCollection[index] || imagesCollection[imagesCollection.length - 1]
  lightboxImage.setAttribute('src', next.getAttribute('src'))
}

const nextImage = () => {
  const lightboxImage = document.querySelector('.lightboxImage')
  const activeImage = getActiveImage()
  const imagesCollection = getImagesCollection()
  let index = 0
  let next = null

  imagesCollection.forEach((item, i) => {
    if (activeImage.getAttribute('src') === item.getAttribute('src')) {
      index = i + 1
    }
  })

  next = imagesCollection[index] || imagesCollection[0]
  lightboxImage.setAttribute('src', next.getAttribute('src'))
}

const listeners = options => {
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (options.lightBox && item.tagName === 'IMG') {
        openLightBox(item, options.lightboxId)
      }
    })
  })

  const navLinks = document.querySelectorAll('.nav-link')
  const mgPrev = document.querySelector('.mg-prev')
  const mgNext = document.querySelector('.mg-next')

  navLinks.forEach(item => item.addEventListener('click', () => filterByTag(item)))
  mgPrev.addEventListener('click', prevImage)
  mgNext.addEventListener('click', nextImage)
}

const responsiveImageItem = element => {
  if (element.tagName === 'IMG') {
    element.classList.add('img-fluid')
  }
}

const moveItemInRowWrapper = element => {
  const galleryItemsRow = document.querySelector('.gallery-items-row')
  galleryItemsRow.appendChild(element)
}

const wrapItemInColumn = (element, columns) => {
  const parent = element.parentNode
  let columnClasses = ''
  if (columns.xs) {
    columnClasses += ` col-${Math.ceil(12 / columns.xs)}`
  }
  if (columns.sm) {
    columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`
  }
  if (columns.md) {
    columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`
  }
  if (columns.lg) {
    columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`
  }
  if (columns.xl) {
    columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`
  }
  const div = document.createElement('div')
  div.setAttribute('class', `item-column mb-4${columnClasses}`)
  parent.removeChild(element)
  div.appendChild(element)
  parent.appendChild(div)
}

const showItemTags = (gallery, position, tags) => {
  let tagItems =
    '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>'
  tags.forEach((item, index) => {
    tagItems += `<li class="nav-item active">
            <span class="nav-link"  data-images-toggle="${item}">${item}</span></li>`
  })
  const tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`

  if (position === 'bottom') {
    gallery.insertAdjacentHTML('beforeend', tagsRow)
  } else if (position === 'top') {
    gallery.insertAdjacentHTML('afterbegin', tagsRow)
  } else {
    console.error(`Unknown tags position: ${position}`)
  }
}

module.exports = options => {
  const tagsCollection = []

  createRowWrapper(gallery)
  if (options.lightBox) {
    createLightBox(
      gallery,
      options.lightboxId,
      options.navigation
    )
  }

  galleryItems.forEach(item => {
    responsiveImageItem(item)
    moveItemInRowWrapper(item)
    wrapItemInColumn(item, options.columns)
    const theTag = item.dataset.galleryTag

    if (
      options.showTags &&
      theTag !== undefined &&
      tagsCollection.indexOf(theTag) === -1
    ) {
      tagsCollection.push(theTag)
    }
  })

  if (options.showTags) {
    showItemTags(gallery, options.tagsPosition, tagsCollection)
  }

  listeners(options)
  gallery.style.display = 'block'
}
