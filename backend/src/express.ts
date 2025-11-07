import express from "express";
import mysql  from "mysql";
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'dbuser',
  password: 's3kreee7',
  database: 'my_db'
})
const app = express();
const port = 3000;

app.get(`/`, (req: any, res: any) => {
    res.send("Hello World!");
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})