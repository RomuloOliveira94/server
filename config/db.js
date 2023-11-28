const { default: mongoose } = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const connectionDb = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.1kmlv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    );
    console.log("Connection with db, success!");
    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

connectionDb();

module.exports = connectionDb;
