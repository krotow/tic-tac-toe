# Tic-Tac-Toe)

> Game UI is implemented in [Latvian language](https://en.wikipedia.org/wiki/Latvian_language).

This web application implements a modified popular game "Tic-Tac-Toe" 
algorithm for playing by two human players in a web browser.

Unlike the original "Tic-Tac-Toe" game, played in a square field and where
winning player must fill the entire row, column or one of the diagonals, this
game modification allows to play on rectangular square field and have different
marked cell number for a win.

# Game rules

1.  The game field size is 2x2 to 10x10 cells.

2.  Players take turns by placing their marks in the free squares of the field
    (cross or zero).

3.  It is not possible to skip the turn.

4.  The winner of the game is the player who filled a single line - row, column
    or diagonal - with his marks.

5.  The result of the game is a draw if there is no free cell left on the field
    and no one has won.

# Game progress

When starting a new game, set the game conditions:

*   The game field size in the "Laukums" fields. From 2 to 10 cells.
*   Number of cell required for a win in "Uzvaras virknes garums" field. The
    shortest - 2 cells. Tallest - smallest column number or the number of row
    cells from the "Laukums" fields.
*   The name of the player who will play with the cross in the "Spēlētājs X"
    field.
*   The name of the player who will play with a zero in the "Spēlētājs O"
    field.

Default game field length, width, and winning string length - 3 cells.

The specified game conditions can be reset to the defaults by pressing the
"Atiestatīt" button.

Start a new game by clicking the "Sākt spēli" button. In the "Spēli sāk" frame
select the player who makes the first move.

Players make turns by clicking in the empty game field cells. The game ends
when one of the players on the same line fill the number of cells with his 
mark, matching with a required cells number for a win. Or no free cells are
remain in a field.

It is possible to continue game with a new round on a clear field by pressing
the "Turpināt" button. The first player in a new game round is the player who
started the second at last time.

To stop the game and set new game conditions, press the button "Jauna spēle".

# Demo

Online demo address: http://tic-tac-toe-1gk.pages.dev/

# For developers

The game is designed as a single page [Node.js](https://nodejs.org/en/) Web
application, using only HTML, CSS and JavaScript. To ensure automatic
deplayment into [Cloudfare Pages](https://pages.cloudflare.com/), it have
rudimentary [Next.js](https://nextjs.org/) support.

For local demo, the game must be downloaded and installed from the Github repository

```
git clone https://github.com/krotow/tic-tac-toe.git
cd tic-tac-toe
npm install
```

and launched in development mode.

```
npm run dev
```

Then you can open a demo of the game in your browser. Local address: http://localhost:3000/

---
&copy; 2021, Janis Baumanis, [ISC](https://choosealicense.com/licenses/isc/)
