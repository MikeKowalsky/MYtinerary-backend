module.exports = (req, res, next) => {
  //doesn't send response - just adjust it by adding headers
  res.header("Access-Control-Allow-Origin", "*"); //* to give access to any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requestes-With, Content-Type, Accept, Authorization" //to give access to all the headers provided
  );
  if (req.method === "OPTIONS") {
    //to give access to all the methoda provided
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next(); //so that other routes can take over
};
