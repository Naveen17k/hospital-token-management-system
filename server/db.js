const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

module.exports = async () => {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(
      "mongodb://localhost:27017/tokens",
      connectionParams
    );
    console.log("connected to databse");
  } catch (error) {
    console.log("could not connect to database", error);
  }
};
