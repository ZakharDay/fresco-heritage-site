import './index.scss'
import { paintings_filelist } from './filelist'
import { getRandomArbitrary, sample } from './utilities'
// import { speed, paintingSize, grid, types } from './settings'
import { generateGridCells } from './setup'

let filled = false
let image

function fillGridCellsWithPaintings() {
  const allGridCells = document.getElementsByClassName('gridCell')
  const emptyGridCells = []

  for (var i = 0; i < allGridCells.length; i++) {
    if (allGridCells[i].childNodes.length === 0) {
      emptyGridCells.push(allGridCells[i])
    }
  }

  if (emptyGridCells.length != 0) {
    fillGridCellWithPaintings()
    setTimeout(() => fillGridCellsWithPaintings(), 1000)
  }
}

function fillGridCellWithPaintings() {
  const paintingData = getRandomSquarePainting()
  const paintingImage = preloadImage(paintingData['url'])

  paintingImage.onload = () => placeImageInEmptyGridCell(paintingData['url'])
}

function getRandomSquarePainting() {
  const squarePaintings = []

  paintings_filelist.forEach((painting, i) => {
    if (painting['columns'] === 1) {
      squarePaintings.push(painting)
    }
  })

  return sample(squarePaintings)
}

function preloadImage(url) {
  image = new Image()
  image.src = url
  return image
}

function placeImageInEmptyGridCell(url) {
  const allGridCells = document.getElementsByClassName('gridCell')
  const emptyGridCells = []

  for (var i = 0; i < allGridCells.length; i++) {
    if (allGridCells[i].childNodes.length === 0) {
      emptyGridCells.push(allGridCells[i])
    }
  }

  const gridCell = sample(emptyGridCells)

  const paintingElement = document.createElement('div')
  paintingElement.classList.add('painting')
  paintingElement.style.backgroundImage = `url(${url})`
  gridCell.appendChild(paintingElement)
}

document.addEventListener('DOMContentLoaded', () => {
  Promise.all(generateGridCells()).then(fillGridCellsWithPaintings)
})
