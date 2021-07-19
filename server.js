const express = require( 'express' );
const path = require( 'path' );

const app = express();

// Redirect all routes to index.html file
app.use( '/assets', express.static( path.resolve(__dirname, 'public', 'assets' ) ) );

app.get( '/*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'public', 'index.html' ) );
} );

app.listen( process.env.PORT || 3000, () => console.log( 'Server is running...' ) );
