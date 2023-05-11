import formidable from "formidable";
import path from 'path';
import fsPromise from "fs/promises"
import jwt from 'jsonwebtoken';
import { getOrCreateUserByPhone, createOrUpdateNamespace } from '../../db';

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req, res) => {
  if (!req.cookies.token) return res.status(401).json({ error: 'Unauthorized' });
  let token = req.cookies.token;
  let user = jwt.verify(token, process.env.JWT_SECRET);
  let miniUser = await getOrCreateUserByPhone(user.phoneNumber);
  const form = new formidable.IncomingForm({ multiples: true });

  try {
    const namespace = await new Promise((resolve, reject) => {
      form.parse(req);

      form.on('field', (name, value) => {
        if (name === 'namespaceName') {
          req.namespaceName = value;
        }
      });

      form.on('file', async (name, file) => {
        try {
          await saveFile(file, req.namespaceName);
        } catch (err) {
          console.error(err);
          reject(err);
        }
      });

      form.on('end', async () => {
        try {
          const namespace = await createOrUpdateNamespace(req.namespaceName, miniUser.id);
          resolve(namespace);
        } catch (err) {
          console.error(err);
          reject(err);
        }
      });

      form.on('error', (err) => {
        console.error(err);
        reject(err);
      });
    });

    res.status(200).send(namespace);
  } catch (err) {
    res.status(500).send("Error parsing files");
  }
};





const saveFile = async (file, namespaceName) => {
  const uploadDir = `./uploads/${namespaceName}`;
  const uploadPath = path.join(uploadDir, file.originalFilename);

  // // Create the directory if it doesn't exist
  try {
    await fsPromise.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  const data = await fsPromise.readFile(file.filepath);
  await fsPromise.writeFile(uploadPath, data);
  await fsPromise.unlink(file.filepath);
  return;
};


export default (req, res) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
      ? console.log("PUT")
      : req.method === "DELETE"
        ? console.log("DELETE")
        : req.method === "GET"
          ? console.log("GET")
          : res.status(404).send("");
};
