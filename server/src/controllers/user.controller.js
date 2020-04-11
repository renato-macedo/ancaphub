const { userService } = require("../services");
const { fileService } = require("../services");
const {
  getManyUsers,
  getUser,
  verifyUser,
  insertUser,
  updateUser,
  updateUserPassword
} = userService;
const { uploadToS3 } = fileService;
const keys = require("../config/keys");
const fs = require('fs')
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");


const getAll = async (req, res, next) => {
  const filter = req.query.filter || "";
  const filterOn = req.query.filterOn || "";
  let filterQuery = {};

  if (filter.length > 0) {
    const regx = new RegExp(filter, "i");

    if (filterOn.length > 0) {
      filterQuery = { ...filterQuery, [filterOn]: regx };
    } else {
      filterQuery = { ...filterQuery, title: regx };
    }
  }

  try {
    const result = await getManyUsers({ filter: filterQuery });
    res.status(200).send(result);
    next();
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await getUser(id);
    res.status(200).send(result);
    next();
  } catch (e) {
    next(e);
  }
};

const insert = async (req, res, next) => {
  const { name, username, email, password } = req.body;

  try {
    const payload = await insertUser({ name, username, email, password });

    jwt.sign(payload, keys.jwtSecret, { expiresIn: 86400 }, (err, token) => {
      if (err) throw new Error();
      res.status(201).json({ token });
      next();
    });
  } catch (e) {
    next(e);
  }
};

const updateProfile = async (req, res, next) => {
  const { id } = req.user;
  const { name, bio, site, currentCity, birthday } = req.body;

  try {
    const result = await updateUser(id, {
      name,
      bio,
      site,
      currentCity,
      birthday
    });
    res.status(200).send(result);
    next();
  } catch (e) {
    next(e);
  }
};

const updateLocation = async (req, res, next) => {
  const { id } = req.user;
  const coordinates = [req.body.longitude, req.body.latitude];

  try {
    const userUpdated = await updateUser(id, {
      lastLocation: { type: "Point", coordinates },
      geoLocation: true
    });
    const result = {
      lastLocation: userUpdated.lastLocation,
      geoLocation: userUpdated.geoLocation
    };
    res.status(200).send(result);
    next();
  } catch (e) {
    next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  const { id: userId } = req.user;
  const crop = JSON.parse(req.body.data)
  const { x, y, width: w, height: h } = crop.croppedAreaPixels

  try {
    const avatar = await Jimp.read(req.file.path)
    avatar
    .quality(60)
    .crop(x, y, w, h)
    .resize(256, 256)
    .write(`/public/uploads/avatar/${req.file.name}`, async () => {
      const fileContent = fs.createReadStream(`/public/uploads/avatar/${req.file.name}`);
      const upload = await uploadToS3(req.file, fileContent)
      const result = await updateUser(userId, { avatar: upload.url });
      res.send({ _id: result._id, avatar: result.avatar });
      next();
    });
  } catch (err) {
    throw new Error(err)
  }
};

const updateUsername = async (req, res, next) => {
  const { id: userId } = req.user;
  const { username } = req.body;

  try {
    await verifyUser({ username });
    const result = await updateUser(userId, { username });
    res.send({ _id: result._id, username: result.username });
    next();
  } catch (e) {
    next(e);
  }
};

const updateEmail = async (req, res, next) => {
  const { id: userId } = req.user;
  const { email } = req.body;

  try {
    await verifyUser({ email });
    const result = await updateUser(userId, { email });
    res.send({ _id: result._id, email: result.email });
    next();
  } catch (e) {
    next(e);
  }
};

const updatePassword = async (req, res, next) => {
  const { id: userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    await updateUserPassword(userId, currentPassword, newPassword);
    res.send({ success: true });
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  get,
  insert,
  updateProfile,
  updateAvatar,
  updateLocation,
  updateUsername,
  updateEmail,
  updatePassword
};
