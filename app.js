import express from 'express'
import logger from 'morgan'
import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import connectMongoose from './lib/connectMongoose.js'
import * as sessionManager from './lib/sessionManager.js'
import {homeController, loginController, productsController} from './controllers/index.js'
import upload from './lib/uploadConfigure.js'
import i18n from './lib/i18nConfigure.js'
import * as langController from './controllers/langController.js'
import * as apiProductsController from './controllers/api/apiProductsController.js'
import * as apiLoginController from './controllers/api/apiLoginController.js'
import swaggerMiddleware from './lib/swaggerMiddleware.js'
import * as jwtAuth from './lib/jwtAuthMiddleware.js'
import basicAuthMiddleware from './lib/basicAuthMiddleware.js'


// espero a que se conecte a la base de datos
console.log('Connecting to DB...')
const { connection: mongooseConnection } = await connectMongoose()
console.log('Conectado a MongoDB en', mongooseConnection.name)

const app = express()

// view engine setup
app.set('views', 'views')
app.set('view engine', 'ejs')

app.locals.siteTitle = 'NodePop'

app.use(logger('dev'))
app.use(express.json()) // parsear el body que venga con formato JSON
app.use(express.urlencoded({ extended: false })) // parsear el body que venga en formato urlencoded (formularios)
app.use(cookieParser())
app.use(express.static('public'))
/**
 * API routes
 */

//Login controller

app.post('/api/login', apiLoginController.loginJWT)

// CRUD operations for products resource
app.get('/api/products', jwtAuth.guard, apiProductsController.apiProductList) //obtiene listado de productos
app.get('/api/products/:productId', jwtAuth.guard, apiProductsController.apiProductGetOne) // Obtiene el owner por id
app.post('/api/products', jwtAuth.guard, upload.single('image'), apiProductsController.apiProductNew) // Crea un nuevo producto
app.put('/api/products/:productId', jwtAuth.guard, upload.single('image'),apiProductsController.apiProductUpdate) // Actualiza el producto
app.delete('/api/products/:productId', jwtAuth.guard, apiProductsController.apiProductDelete)// Borra el producto



/**
 * Website routes
 */

app.use(sessionManager.middleware, sessionManager.useSessionInViews)
app.use(i18n.init)
app.get('/change-locale/:locale', langController.changeLocale)
app.get('/', homeController.index) // revisar

app.use('/api-doc', swaggerMiddleware)


// session
app.get('/login', loginController.indexLogin)
app.post('/login', loginController.postLogin)
app.all('/logout', loginController.logout)

{
// products
  const productsRouter = express.Router()

  // productsRouter.use(session.guard) -- optional
  productsRouter.get('/new', productsController.indexNew)
  productsRouter.post('/new', upload.single('image'), productsController.postNew) //add image to a product
  productsRouter.get('/delete/:productId', productsController.deleteOne)
  app.use('/products', sessionManager.guard, productsRouter)

}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)

  //API error, send response with JSON
  if(req.url.starWith('/api/')){
    res.json({ error: err.message })
    return
  }

  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.render('error')
})

export default app
