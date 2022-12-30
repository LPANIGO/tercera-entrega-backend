import fs from 'fs';

export default class FilesContainer {
    constructor(path) {
        this.path = path;
    }

    getAll = async() => {
        try {
            if (fs.existsSync(this.path)) {
                const fileData = await fs.promises.readFile(this.path, 'utf-8');
                let collection = JSON.parse(fileData);
                return collection;
            } else {
                let collection = [];
                await fs.promises.writeFile(this.path, JSON.stringify(collection, null, '\t'));
                return collection;
            }
        } catch (error) {
            return {status:"error", error:"No se puede leer el archivo: " + error};
        }
    }

}