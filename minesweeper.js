/**
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *    License, v. 2.0. If a copy of the MPL was not distributed with this
 *    file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *    
 *    Copyright 2021 By Thomas Ruigrok. Some rights reserved 
 */

//logic

export let timer = 0;

let gameStartFlag = false;

export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked'

}

let interval = setInterval(incrementTimer, 1000);

export function createBoard(boardSize, numberOfMines) {
    //NOTE board is an array of arrays
    let board = [];
    
    let minePositions = getMinePositions(boardSize, numberOfMines);
    console.log(minePositions)

    for (let x = 0; x < boardSize; x++) {
        let row = [];
        for (let y = 0; y < boardSize; y++) {
            let element = document.createElement('div')
            element.dataset.status = TILE_STATUSES.HIDDEN;

            let tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, { x, y })),
                get status() {
                    return this.element.dataset.status;
                },

                set status(value) {
                    this.element.dataset.status = value;
                }
            }
            row.push(tile);
        }
        board.push(row);
    }

    return board;
}

export function markTile(tile) {


    if(tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) {
        return
    }

    if(tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN;
    }
    else {
        tile.status = TILE_STATUSES.MARKED;
    }

}

export function revealTile(board, tile) {
    
    if(!gameStartFlag) {
        gameStartFlag = true;
    }

    let adjacentTiles = null;

    if (tile.status !== TILE_STATUSES.MARKED && tile.status !== TILE_STATUSES.HIDDEN) {
        return;
    }

    if(tile.mine) {
        tile.status = TILE_STATUSES.MINE;
        return;
    }

    tile.status = TILE_STATUSES.NUMBER;
    
    adjacentTiles = nearbyTiles(board, tile);
    
    //FIXED: Throws an error occasionally 'cannot read property mine of undefined (Line 80)
    let mines = adjacentTiles.filter(t => t.mine);

    if(mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board))
    }
    else {
        assignColours(mines.length, tile);
        tile.element.textContent = mines.length;
    }
}

function getMinePositions(boardSize, numberOfMines) {
    let positions = [];

    while (positions.length < numberOfMines) {
        let position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        }

        if(!positions.some(p => positionMatch(p, position))) {
            positions.push(position)
        }

        /*
        INFO: Alternate method of writing the above if using bind instead.
        if(!positions.some(positionMatch.bind(null, position))) {
            positions.push(position)
        }
        */
    }

    return positions;
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return (tile.status === TILE_STATUSES.NUMBER || (tile.mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED)))
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

function assignColours(numMines, tile) {
    switch(numMines) {
        case 0: {
            break;
        }
        case 1: {
            tile.element.classList.add("text-blue");
            break;
        }
        case 2: {
            tile.element.classList.add("text-green");
            break;
        }
        case 3: {
            tile.element.classList.add("text-red");
            break;
        }
        case 4: {
            tile.element.classList.add("text-darkBlue");
            break;
        }
        case 5: {
            tile.element.classList.add("text-crimson");
            break;
        }
        case 6: {
            tile.element.classList.add("text-seaGreen");
            break;
        }
        case 7:
        case 8: {
            tile.element.classList.add("text-darkerRed");
            break;
        }
        default: {
            break;
        }
    }
}

function positionMatch(a,b) {
    return a.x === b.x && a.y === b.y
}

function randomNumber(size) {
    return Math.floor((Math.random() * size))
}

function nearbyTiles(board, {x, y}) {
    let tiles = [];

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for(let yOffset = -1; yOffset <= 1; yOffset++) {
            let adjacentTile = board[x + xOffset]?.[y + yOffset]
            if (adjacentTile) tiles.push(adjacentTile);
        }
    }

    return tiles;
}

function incrementTimer() {
    if(gameStartFlag) {
        if(timer === 1000)
            timer = 0;
        else
            timer += 1;
    }
}