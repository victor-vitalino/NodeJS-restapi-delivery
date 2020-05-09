import Signature from '../models/Signature';

class SignnatureController {
    async store(req, res) {
        const { filename: path, originalname: name } = req.file;
        const signature = await Signature.create({ path, name });
        return res.json(signature);
    }
}
export default new SignnatureController();
