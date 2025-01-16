import initApp from "./server_2";

const port = process.env.PORT;

initApp().then((app) => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

});