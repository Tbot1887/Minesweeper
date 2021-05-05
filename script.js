/**
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *    License, v. 2.0. If a copy of the MPL was not distributed with this
 *    file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *    
 *    Copyright 2021 By Thomas Ruigrok. Some rights reserved 
 */

//Display

import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from "./minesweeper.js"

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 2;

let board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
let boardElement = document.getElementById("gameBoard");
let minesLeftText = document.querySelector('[data-mine-count]');
let messageArea = document.getElementById("msgArea");

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener('click', () => {
            revealTile(board, tile);
            checkGameEnd()
        });
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        });
    });
});

function listMinesLeft() {
    let markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0);

    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd() {
    let win = checkWin(board);
    let lose = checkLose(board);

    if(win || lose) {
        boardElement.addEventListener('click', stopProp, { capture: true })
        boardElement.addEventListener('contextmenu', stopProp, { capture: true })

        if(win) {
            messageArea.textContent = "You Win!";
        }
        else {
            messageArea.textContent = "You Lose!"
            board.forEach(row => {
                row.forEach(tile => {
                    if(tile.status === TILE_STATUSES.MARKED) {
                        markTile(tile);
                    }
                    if(tile.mine) {
                        revealTile(board, tile)
                    }
                })
            })
        }
    }

}

function stopProp(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
}

boardElement.style.setProperty('--size', BOARD_SIZE);
minesLeftText.textContent = NUMBER_OF_MINES;

//DONE: Populate Board with tiles / mines
//DONE: Left Click on tiles
//DONE: Reveal Tiles
//DONE: Right Click on tiles
//DONE: Mark Tiles
//TODO: Check for win/loose

