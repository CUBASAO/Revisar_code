import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose"; //para conectar con la base de datos
import router from "./router";

//CONEXION A LA BASE DE DATOS

mongoose.Promise = global.Promise;
/**
 * - Definicinion de variable encargada  de la URL para la conexión de my bbdd
 * - 27017 puerto para usar la bd de mongodb
 */
const dbUrl = "mongodb://localhost:27017/climboots"; 
//Conexión con mi bd climbootsde mongodb ,respuesta de fallo o conexion exitosa
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((mongoose) => {
    console.log("CONECTADO A LA BD EN EL PUERTO 27017");
  })
  .catch((err) => {
    console.log("ERROR AL CONECTAR CON LA BD:", err);
  });

  //Declaracion de express para configuracion base
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/", router);

app.set("port", process.env.PORT || 3000);// en caso de no tener una variable de entorno ejecutaremos en el puerto 3000

app.listen(app.get("port"), () => {
  console.log("EL SERVIDOR SE EJECUTO CORRECTAMENTE EN EL PUERTO 3000");
});
