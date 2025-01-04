import initApp from "./server_2"; 
const port = process.env.PORT;

const tmpFunc = async () => {
   const app = await initApp();
   app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

tmpFunc();



