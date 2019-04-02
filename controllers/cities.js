const City = require("../models/City");

exports.getCities = async (req, res) => {
  try {
    const docs = await City.find();
    res.send(docs);
  } catch (err) {
    err => console.log(err);
  }
};
