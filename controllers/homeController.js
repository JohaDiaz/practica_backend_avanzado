import { Product } from '../models/index.js'

/**
 * @swagger
 * /:
 *   get:
 *     summary: Página de inicio
 *     description: Muestra la página principal con los productos.
 *     responses:
 *       200:
 *         description: Página principal cargada correctamente.
 */

export async function index(req, res, next) {
  try {
    const userId = req.session.userId

    if (userId) {
      const pageSize = 3
      const skip = parseInt(req.query.skip) || 0
      const limit = parseInt(req.query.limit) || pageSize
      const sort = req.query.sort || '_id'
      const price = req.query.price
      const name =req.query.name

      const filters = {
        owner: userId
         
        }
      if (name){
        filters.name = name
      }

      if (req.query.tag) filters.tags = { $in: req.query.tag }

      if (typeof price !== 'undefined' && price !== '-') {
        if (price.indexOf('-') === -1) filters.price = price
        else {
          filters.price = {}
          const range = price.split('-')
          if (range[0] !== '') filters.price.$gte = range[0]
          if (range[1] !== '') filters.price.$lte = range[1]
        }
      }

      if (typeof req.query.nombre !== 'undefined') {
        filters.nombre = new RegExp('^' + req.query.nombre, 'i')
      }

      const totalCount = await Product.find(filters).countDocuments()
      res.locals.products = await Product.list(filters, skip, limit, sort)

      // pagination
      res.locals.pageSize = pageSize
      res.locals.skipPrev = skip - pageSize
      res.locals.skipNext = skip + pageSize
      res.locals.totalCount = totalCount

    }

    res.render('home', { variable: 'Express'})
  } catch (error) {
    next(error)
  }
}
