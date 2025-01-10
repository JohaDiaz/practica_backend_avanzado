import jwt from 'jsonwebtoken'
import createError from 'http-errors'

export function guard(req, res, next){
    // sacar el tokenJWT de la cabecera, body, o de la query-string
    // apuntar esto en la documentación de autorizaición de la API. Se debe indicar que cuando se quiera hacer una petición, el jwt que te da el login se deberá poner en una cabecera que se llame "Authorization"
    const tokenJWT = req.get('Authorization') || req.body.jwt || req.query.jwt

    // si no tengo token --> error 
    if (!tokenJWT) {
        next(createError(401), 'No token provided')
        return
    }

// compruebo que el token es válido
jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
        if (err){
            next(createError(401, 'Invalid token'))
            return
        }

        // apuntamos el id del usuario logado en la request
        // para que los próximos middlewares puedan leerlos de ahí
        req.apiUserId = payload._id
        next()
    })
}
