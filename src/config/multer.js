import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, cb) => {
            // modificando nome do arquivo
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err);

                return cb(
                    null, // erro vai como null msm
                    // nome do arquivo = string aleatoria + extensão do arquivo
                    res.toString('hex') + extname(file.originalname)
                );
            });
        },
    }),
};
