import { User } from '../models/index.js';



export async function indexLogin(req, res, next) {
  res.locals.error = '';
  res.locals.email = '';
  res.render('login');
}


/**
 * @swagger
 * /login:
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

export async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    // buscar el usuario en la base de datos
    const user = await User.findOne({ email: email.toLowerCase()});

    // si no lo encuentro o la contraseña no coincide --> error
    if (!user || !(await user.comparePassword(password)) ) {
      res.locals.error = `${res.__('Invalid credentials')}`;
      res.locals.email = email;
      res.render('login');
      return;
    }

    // si existe y la contraseña coincide:

    // - apuntar en la sesión del usuario, que está autenticado
    req.session.userId = user._id;
    req.session.userName = user.name;

    // - ir a zona privada
    res.redirect(req.query.redirect ?? '/');

  } catch (err) {
    next(err);
  }
}

export function logout(req, res, next) {
  req.session.regenerate(err => {
    if (err) return next(err);
    res.redirect('/');
  })
}
