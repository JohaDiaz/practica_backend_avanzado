import createError from 'http-errors'
import Product from '../../models/Product.js'

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Recuperar una lista de productos
 *     description: Recuperar una lista de productos basada en filtros, paginación y criterios de ordenamiento.
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filtrar productos por etiqueta.
 *       - in: query
 *         name: min-price
 *         schema:
 *           type: number
 *         description: Precio mínimo de los productos.
 *       - in: query
 *         name: max-price
 *         schema:
 *           type: number
 *         description: Precio máximo de los productos.
 *       - in: query
 *         name: product-name
 *         schema:
 *           type: string
 *         description: Filtrar productos por nombre.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Campo para ordenar.
 *       - in: query
 *         name: direction
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Dirección del ordenamiento.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para la paginación.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de productos por página.
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Campos a incluir en la respuesta, separados por comas.
 *     responses:
 *       200:
 *         description: Lista de productos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *              
 *                 totalRecords:
 *                   type: integer
 *                   description: Número total de productos.
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas.
 *                 currentPage:
 *                   type: integer
 *                   description: Número de la página actual.
 *    
 */

export async function apiProductList(req, res, next){
  try {
    console.log('el usuario es: ', req.apiUserId)

        const userId = req.apiUserId
       //http://localhost:3000/api/products/?name=Bicicleta&price=23015
        const filterprice = req.query.price
        const filtername = req.query.name
        //http://localhost:3000/api/products/?limit=2&skip=2
        const skip = req.query.skip
        const limit = req.query.limit
        //http://localhost:3000/api/products/?sort=name
        const sort = req.query.sort
        const fields = req.query.fields

        //http://localhost:3000/api/products/?fields=name -_id 
        //http://localhost:3000/api/products/?limit=2&skip=2&name=Zapatillas    (revisar este filtro por qué no lo aplica)

        const filter = { owner: userId }

        if (filterprice){
          filter.price = filterprice
        }
 
        if (filtername){
          filter.name = filtername
        }
       
        const [products, productCount] = await Promise.all([
          Product.list(filter, limit, skip, sort, fields),
          Product.countDocuments(filter)
        ])

        res.json({
          results: products,
          count: productCount
          
        })

    } catch (error) {
        next(error)
    }
    
}

//obtener un producto por su id

export async function apiProductGetOne(req, res, next) {
  try{
    const userId = req.apiUserId
    const productId = req.params.productId

    const product = await Product.findOne({_id: productId, owner: userId})

    res.json ({result: product})

  } catch(error){
    next (error)
  } 
  
}

//crea un nuevo producto
export async function apiProductNew(req, res, next){
  try{
    const userId = req.apiUserId

    const productData = req.body
    console.log(productData)

    //create agent instance in memory

    const product = new Product(productData)
    product.owner = userId
    product.image = req.file?.filename // el file es opcional. Si existe req.file, coge la propiedad filename. Si no existe, no asigna nada y no falla.

    //save product

    const savedProduct = await product.save()

    res.status(201).json({result: savedProduct})

  }catch (error){
    next(error)
  }
}

// update product
export async function apiProductUpdate(req, res, next) {

  try{
    const userId = req.apiUserId
    const productId = req.params.productId
    const productData = req.body

    productData.image = req.file?.filename

    const updatedProduct = await Product.findOneAndUpdate({ _id: productId, owner: userId }, productData, {
      new: true // para obtener el documento actualizado
    })

    res.json({ result: updatedProduct }) // se añade aquí para poder obtener este dato de una vez y poder mostrarlo si es solicitado

  }catch(error){
    next(error)
  }
  
}

//delete product

export async function apiProductDelete(req, res, next){

  try{
    const userId = req.apiUserId
    const productId = req.params.productId
    
    // validar que el documento que queremos borrar pertenece al usuario

    const product = await Product.findOne ({ _id: productId })

    // verificamos si existe

    if (!product) {
      console.warn(`WARNING - el usuario ${userId} intentó eliminar un producto inexistente (${productId})`)
      return next(createError(404))
    }

    // comprobamos la propiedad antes de eliminar
    // product.owner es un ObjetId y para comprarlo con un string
    // necesitamos convertirlo a texto.
    if (product.owner.toString() !== userId){
      console.warn(`WARNING - el usuario ${userId} intentó eliminar un producto que es propiedad de otro usuario (${productId})`)
      return next(createError(401))

    }

    await Product.deleteOne({ _id: productId })
    res.json()

  }catch(error){
    next(error)
  }
}