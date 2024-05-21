import { useState, useRef } from 'react'
import './App.css'

/*
TOP LEVEL STUFF

grid variables


BUILT A GRID COMPONENT

Parametrit: Rows ja cols
Return: GridObject {Row0 { Col0, Col1, ...} Row1 { Col0, Col1, ...} ...}


COMPONENTTI JOKA VASTAAN OTTAA GRIDIN, JA LUO NODEJEN ARVOT

Parametrit: GridObject
Return: Jokaiselle nodelle: Status(Neutral, start, end, wall), id, key, neighbours

MAIN COMPONENT/APP

Default componentti, antaa käskyn gridin luomiselle.
Muokataan/Annetaan classNamet

Return osa: <div>GridDiv</div><div>OnClick functiot eri toiminnoille(Gridin arvojen muuttaminen, algorytmin valinta)</div>


ALGORYMIT

Mitä näitä ny on
*/



const GridNodes = ({ cols, rows }) => {
  let grid = {};

  for (let i = 0; i < rows; i++) {
    let rowKey = `Row${i}`
    grid[rowKey] = {}
    for (let j = 0; j < cols; j++) {
      let nodeKey = `Col${j}`
      grid[rowKey][nodeKey] = {Kissa: "Kissa"}
    }
  }
  console.log(grid)
  return grid;

}




function App() {

  const cols = 5;
  const rows = 5;

  GridNodes({cols, rows})

  let grid = GridNodes({cols, rows})
  
  const status = {
    NEUTRAL: "Neutral",
    IS_START: "isStart",
    IS_END: "isEnd",
    IS_WALL: "Wall",
    ON_PATH: "Path",
  }

  let startRef = useRef(0);
  let endRef = useRef(7);

  return (
    <>
      <div className="gridHolder">
        {grid.map((elem) => {
          return elem;
        })}
      </div>
    </>
  )

}

export default App
