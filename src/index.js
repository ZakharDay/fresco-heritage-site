import './index.scss'
import { paintings_filelist } from './filelist'
import { getRandomArbitrary, sample } from './utilities'
// import { speed, paintingSize, grid, types } from './settings'
import { speed, grid, size } from './settings'
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
  } else {
    cycle()
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

function getRandomLargePainting() {
  const squarePaintings = []

  paintings_filelist.forEach((painting, i) => {
    if (painting['columns'] != 1) {
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

function cycle() {
  const cycleTimeout = getRandomArbitrary(speed * 30, speed * 100)
  setTimeout(() => cycle(), cycleTimeout)

  const nextCycleFunction = sample([
    changeFewSquarePaintings,
    changeOneLargePainting
  ])

  nextCycleFunction()
}

function changeFewSquarePaintings() {
  const gridCells = document.getElementsByClassName('gridCell')
  const times = getRandomArbitrary(1, 3)
  let timeout = getRandomArbitrary(speed * 50, speed * 100)

  for (var i = 0; i < times; i++) {
    const randomCellIndex = Math.floor(getRandomArbitrary(0, gridCells.length))
    const paintingData = getRandomSquarePainting()
    const paintingImage = preloadImage(paintingData['url'])

    paintingImage.onload = () => {
      const gridCell = document.getElementsByClassName('gridCell')[
        randomCellIndex
      ]

      setTimeout(
        () =>
          removePainting(gridCell).then(() =>
            addSquarePainting(gridCell, paintingData['url'])
          ),
        timeout
      )

      timeout += getRandomArbitrary(speed * 50, speed * 150)
    }
  }
}

function changeOneLargePainting() {
  const paintingData = getRandomLargePainting()
  const paintingImage = preloadImage(paintingData['url'])

  paintingImage.onload = () => {
    const gridCells = document.getElementsByClassName('gridCell')
    const gridCellWidth = gridCells[0].getBoundingClientRect().width

    const maxColumns = grid['columns'] - paintingData['columns']
    const startColumn = Math.floor(getRandomArbitrary(0, maxColumns))

    const maxRows = grid['rows'] - paintingData['rows']
    const startRow = Math.floor(getRandomArbitrary(0, maxRows))

    let timeout = speed * 10
    let row = 1
    let column = 1

    for (var r = 0; r < paintingData['rows']; r++) {
      for (var c = 0; c < paintingData['columns']; c++) {
        let gridCellIndex =
          r * grid['columns'] +
          (c + 1) +
          ((startRow - 1) * grid['columns'] + startColumn)

        const gridCell = document.getElementsByClassName('gridCell')[
          gridCellIndex
        ]

        let position

        if (row === 1 && column === 1) {
          position = 'top left'
        } else if (row === 1 && column === paintingData['columns']) {
          position = 'top right'
        } else if (row === paintingData['rows'] && column === 1) {
          position = 'bottom left'
        } else if (
          row === paintingData['rows'] &&
          column === paintingData['columns']
        ) {
          position = 'bottom right'
        } else if (
          row === 1 &&
          column != 1 &&
          column != paintingData['columns']
        ) {
          position = `-${(column - 1) * gridCellWidth}px 0`
        } else if (row != 1 && row != paintingData['rows'] && column === 1) {
          position = `0 -${(row - 1) * gridCellWidth}px`
        } else {
          position = `-${(column - 1) * gridCellWidth}px -${
            (row - 1) * gridCellWidth
          }px`
        }

        setTimeout(
          () =>
            removePainting(gridCell).then(() =>
              addLargePainting(gridCell, paintingData, position)
            ),
          timeout
        )

        timeout += speed

        if (column >= paintingData['columns']) {
          column = 1
        } else {
          column++
        }
      }

      row++
    }
  }
}

function removePainting(gridCell) {
  return new Promise(function (resolve, reject) {
    const painting = gridCell.childNodes[0]
    painting.classList.add('fadeOut')
    setTimeout(() => resolve(), 1500)
  })
}

function addSquarePainting(gridCell, url) {
  const paintingElement = document.createElement('div')
  paintingElement.classList.add('painting')
  paintingElement.style.backgroundImage = `url(${url})`
  gridCell.innerHTML = ''
  gridCell.appendChild(paintingElement)
}

function addLargePainting(gridCell, paintingData, position) {
  const paintingElement = document.createElement('div')
  paintingElement.classList.add('painting')
  paintingElement.style.backgroundImage = `url(${paintingData['url']})`
  paintingElement.style.backgroundSize = `${paintingData['columns']}00% ${paintingData['rows']}00%`
  paintingElement.style.backgroundPosition = position
  gridCell.innerHTML = ''
  gridCell.appendChild(paintingElement)
}

document.addEventListener('DOMContentLoaded', () => {
  Promise.all(generateGridCells()).then(fillGridCellsWithPaintings)
})
