import createError from 'http-errors'
import { Product } from '../models/index.js'

export async function indexNew(req, res, next) {
  res.render('products/new')
}

export async function postNew(req, res, next) {
  try {
    const userId = req.session.userId
    const productData = req.body

    console.log(req.file)

    // creamos una instancia de producto en memoria
    const product = new Product(productData)
    product.owner = userId
    product.price = Math.trunc(product.price * 100) // store only 2 decimals
    product.image = req.file.filename //product image
    product.tags = product.tags?.filter(tag => !!tag) // filter blank tags

    // la persistimos en la BD
    const savedProduct = await product.save()

    res.redirect('/');
  } catch (error) {
    next(error)
  }
}

export async function deleteOne(req, res, next) {
  try {
    const userId = req.session.userId
    const productId = req.params.productId

    // validar que el producto que queremos borrar es propiedad del usuario!!!!
    const product = await Product.findOne({ _id: productId })

    // verificar que existe
    if (!product) {
      console.warn(`WARNING - el usuario ${userId} intentó eliminar un producto inexistente (${productId})`)
      return next(createError(404, 'Not found'))
    }

    // product.owner viene de la base de datos y es un ObjectId
    if (product.owner.toString() !== userId) {
      console.warn(`WARNING - el usuario ${userId} intentó eliminar un producto (${productId}) propiedad de otro usuario (${product.owner})`)
      return next(createError(401, 'No autorizado'))
    }

    await Product.deleteOne({ _id: productId })

    res.redirect('/')

  } catch (error) {
    next(error)
  }
}