//Como necesitamos hacer uso de algo que está fuera de este archivo lo
//primero es importarlo para poder usarlo, esto se hace con un require
const express = require("express");
//Una vez tenemos la función de expres definida, la utilizamos para
//crear nuestro núcleo del servidor la variable app
app = express();

const http = require("http");
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
app.set("io",io);

/// Settings Section
//En esta sección vamos a definir dentro de app, variables que se
//usarán en todo el proyecto, algo como variables globales
//El process.env.PORT permite coger el puerto predefinido del host
//donde tengamos alojado el servidor
app.set("port", process.env.PORT || 3000); //Si lo pones aquí lo puedes
//obtener desde cualquier lugar usando app.get("port");
app.set("json spaces", 2); //Esto configura los espacios de los json
//para que se lea mejor, estamos alterando una variable que usa express
//ya por defecto.
/// Middlewares
//Los Middlewares son programas o librerías que se incluyen de forma
//que aportan a la funcionalidad inicial, como indica su nombre están en
//medio.
//Inicializamos morgan para que nos lea las trazas del servidor
const morgan = require("morgan");
//Depende del parámetro indicado en el constructor nos dará más o menos
//información.
app.use(morgan("dev"));
//app.use(morgan("combined"));
//Ahora configuramos express para que pueda entender la información que
//recibe de las llamadas, el extended false es porque no queremos que lea
//cosas complejas como imágenes
app.use(express.urlencoded({extended: false}));
app.use(express.json()); //Para que el express pueda trabajar con JSON
/// Routes
//En esta sección definimos las rutas accesibles de la web y que
//responden, mas adelante mejoraremos esto para que sea mas limpio
//trabajar
//app.get("/", (req, res) => {
//Hay varias maneras de devolver información, las iremos viendo.
//res.send({"Hello World"); //Manda una string
//res.json({"Title": "Hello World"}); //manda un JSON
//});
app.use(require("./routes/_routes"));
/// Start Server
//Arrancamos el servidor usando el puerto definido anteriormente,
//obtenemos nuestra IP y la mostramos por consola.
server.listen(app.get("port"), () => {
const ip = GetIp();
const port = app.get("port");
console.log("Servidor en la url: http://" + ip + ":" + port + "/");
});
//Función de ayuda para obtener la IP
const { networkInterfaces } = require("os");
GetIp = () => {
const nets = networkInterfaces();
const results = {};
for (const name of Object.keys(nets))
{
for(const net of nets[name])
{
const ipv4Family = typeof net.family == "string" ? "IPv4" :
4
if(net.family === ipv4Family && !net.internal) {
if(!results[name])
{
results[name] = [];
}
results[name].push(net.address);
}
}
}
//return results;
return results["enp0s3"][0]; //La Ip
}