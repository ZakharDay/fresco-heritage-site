import { grid } from './settings'

function generateGridCells() {
  const quantity = grid['columns'] * grid['rows']
  const promises = []

  for (var i = 0; i < quantity; i++) {
    promises.push(addGridCell())
  }

  return promises
}

function addGridCell() {
  return new Promise((resolve, reject) => {
    const gridCell = document.createElement('div')
    gridCell.classList.add('gridCell')
    document.getElementById('fresco').appendChild(gridCell)

    resolve()
  })
}

export { generateGridCells }
