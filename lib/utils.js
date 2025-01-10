import { createRequire } from 'node:module';

export const require = createRequire(import.meta.url);

// Node < 20.11
// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
// export const __filename = fileURLToPath(import.meta.url);
// export const __dirname = dirname(__filename);

// Node >= 20.11
export const __filename = import.meta.filename

// import.meta.dirname existe desde Node 20.11
export const __dirname = import.meta.dirname


//En CommonJS para referenciar la carpeta actual:
// __dirname

//En ESM (Ecma Script Modules) en Node 20.11 o superior usamos:
// import.meta.dirname

//En ESM (Ecma Script Modules) en Node inferior a 20.11:
//import { dirname } from 'node:path'
//import { fileURLToPath } from 'node:url'
//export const __filename = fileURLToPath(import.meta.url)
//export const __dirname = dirname(__filename)


