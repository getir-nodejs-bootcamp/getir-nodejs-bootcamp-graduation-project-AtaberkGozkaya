const app = require("./app");
const { RecordRoute } = require("./routes");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
