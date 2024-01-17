const express = require( "express" );
const bodyParser = require( 'body-parser' );
const cors = require("cors");
const dotenv = require( "dotenv" );
const routes = require( "./routes/routes.js" );
const category = require( "./routes/categoryRoutes.js" );
const product = require( "./routes/productRoutes.js" );
const order = require( "./routes/orderRoutes.js" );
const connectDb=require('./configDB/connectDB')
const app = express();
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(express.json());
app.use(cors());
const port = 8000;
dotenv.config();
connectDb();
// app.use(express.static(path.join(__dirname, "public")));
app.use( "/", routes );
app.use( "/category", category );
app.use( "/product", product );
app.use( "/order", order );
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});
app.listen( port) ;
