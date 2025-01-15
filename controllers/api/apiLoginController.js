import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'


/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica al usuario y crea una sesión.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       401:
 *         description: Credenciales inválidas.
 */

export async function loginJWT(req, res, next) {
    try{

        const{ email, password } = req.body

        //TODO validar que email y password llegan

        // buscar el usuario en la base de datos
        const user = await User.findOne({ email: email.toLowerCase() });

        // si no lo encuentro o la contraseña no coincide --> error
        if (!user || !(await user.comparePassword(password)) ) {
            next(createError(401, 'Invalid credentials'))
            return
        }

        // si lo encuentro y coincide la contraseña --> emitir un JWT 
        jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '2d'
        }, (err, tokenJWT) => {
            if (err){
                next(err)
                return
            }
            res.json( tokenJWT)
        })

    }catch(error){
        next(error)
    }
    
}