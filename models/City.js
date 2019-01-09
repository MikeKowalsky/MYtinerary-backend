const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  itineraries: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Inerinary"
      }
    }
    // {
    //   id: {
    //     type: Schema.Types.ObjectId,
    //     ref: "inerinaries"
    //   },
    //   name: String
    // }
  ]
});

//Export schema as a module
module.exports = mongoose.model("City", schema);

//To use our schema definition, we need to convert our CitySchema into a Model we can work with. Doing this while exporting.

//Schemas not only define the structure of your document and casting of properties, they also define document instance methods, static Model methods, compound indexes, and document lifecycle hooks called middleware.

// var schema = new mongoose.Schema({ name: 'string', size: 'string' });
// var Tank = mongoose.model('Tank', schema);
// The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural version of your model name. Thus, for the example above, the model Tank is for the tanks collection in the database.
