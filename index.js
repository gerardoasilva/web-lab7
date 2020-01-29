let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let jsonParser = bodyParser.json();
let uuidv4 = require("uuid/v4");
let { CommentList } = require("./model");
let { DATABASE_URL, PORT } = require("./config");

let app = express();

app.use(express.static('public'));
app.use(morgan("dev"));

/*

let comentario = {
    id: uuid.v4(),
    titulo: string,
    contenido: string,
    autor: string,
    fecha: Date
}

*/

// let comentarios = [
//   {
//     id: uuidv4(),
//     titulo: "Pienso, luego existo.",
//     contenido:
//       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, aperiam! Eum dolorum consectetur ratione, vitae laudantium eius, quisquam omnis quidem quibusdam eos libero commodi ipsa!",
//     autor: "Aurturo Manríquez",
//     fecha: "2020-01-23"
//   },
//   {
//     id: uuidv4(),
//     titulo: "La cruda realidad",
//     contenido:
//       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, aperiam! Eum dolorum consectetur ratione!",
//     autor: "Elizabeth Morales",
//     fecha: "2020-01-23"
//   },
//   {
//     id: uuidv4(),
//     titulo: "¡La mejor obra de teatro!",
//     contenido:
//       "Adipisicing elit. Qui, aperiam! Eum dolorum consectetur ratione, vitae laudantium eius, quisquam omnis ipsa!",
//     autor: "La Rosalía",
//     fecha: "2020-01-23"
//   },
//   {
//     id: uuidv4(),
//     titulo: "No puede haber una mejor representación...",
//     contenido:
//       "Lorem dantium eius, quisquam omnis quidem quibusdam eos libero commodi ipsa!",
//     autor: "Genaro García",
//     fecha: "2020-01-23"
//   }
// ];

// Función que retorna fecha actual
function getFecha() {
  var d = new Date(),
    day = "" + d.getDate(),
    month = "" + d.getMonth() + 1,
    year = "" + d.getFullYear();

  return [year, month, day].join("-");
}

// GET METHODS
// CARGAR comentarios
app.get("/blog-api/comentarios", (req, res) => {
    CommentList.getAll()
    .then(comments => {
        return res.status(200).json(comments);
    })
    .catch(error => {
        res.statusMessage = "Hubo un problema con la base de datos";
        return res.status(500).send();
    });
});


// BUSCAR comentarios por autor
app.get("/blog-api/comentarios-por-autor", (req, res) => {
  if (!req.query.autor) {
    res.statusMessage = "No es posible hacer la búsqueda, dato faltante";
    return res.status(406).send();
  }

  let autor = req.query.autor;

  CommentList.getAllByAuthor(autor)
  .then(comments => {
    if(comments.length > 0) {
        return res.status(200).json(comments);
    } else {
        res.statusMessage = "El autor " + autor + " no tiene comentarios";
      return res.status(404).send();
    }
  })
  .catch(error => {
      throw Error(error);
  });
});

// POST METHOD
// AGREGAR comentario
app.post("/blog-api/nuevo-comentario", jsonParser, (req, res) => {

  if(!req.body.titulo || !req.body.contenido || !req.body.autor) {
    res.statusMessage = "No es posible agregar el comentario, datos faltantes";
    return res.status(406).send();
  }

  let newComment = {
    id: uuidv4(),
    titulo: req.body.titulo,
    contenido: req.body.contenido,
    autor: req.body.autor,
    fecha: getFecha()
    };

  CommentList.addComment(newComment)
  .then(comentario => {
    res.statusMessage = "El comentario ha sido agregado exitosamente";
    return res.status(201).send(comentario);
  })
  .catch(error => {
    res.statusMessage = "Hubo un problema con la base de datos";
    return res.status(500).send();
  });
});

// DELETE METHOD
// ELIMINAR comentario
app.delete("/blog-api/remover-comentario/:id", (req, res) => {
  let id = req.params.id;

  CommentList.deleteComment(id)
  .then(comentario => {
    return res.status(200).send();
  })
  .catch(error => {
    res.statusMessage = "No se encontró el comentario con id: " + id;
    return res.status(404).send();
  });
});

// PUT METHOD
// MODIFICAR comentario
app.put("/blog-api/actualizar-comentario/:id", jsonParser, (req, res) => {
  let idParam = req.params.id;

  if (!req.body.id) {
    res.statusMessage = "ID faltante";
    return res.status(406).send();
  }

  let idBody = req.body.id;

    if (idParam != idBody) {
        res.statusMessage = "ID de JSON no coincide con ID en URL";
        return res.status(409).send();
    }

      if (!req.body.titulo && !req.body.contenido && !req.body.autor) {
        res.statusMessage = "No hay datos para actualizar";
        return res.status(406).send();
      }

      let data = {};

      if(req.body.titulo != "") {
          data.titulo = req.body.titulo;
      }
      if(req.body.contenido != "") {
          data.contenido = req.body.contenido;
      }
      if(req.body.autor != "") {
          data.autor = req.body.autor;
      }

      CommentList.updateComment(idParam, data)
      .then(result => {
          if(result) {
            return res.status(202).send(result);
          } else {
            res.statusMessage = "No existe el comentario con id: " + idParam;
            return res.status(404).send();
          }
      })
      .catch(error => {
          throw Error(error);
      });
});

let server;

function runServer(port, databaseUrl) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, response => {
      if (response) {
        return reject(response);
      } else {
        server = app
          .listen(port, () => {
            console.log("App is running on port " + port);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            return reject(err);
          });
      }
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing the server");
      server.close(err => {
        if (err) {
          return reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

runServer(PORT, DATABASE_URL);

module.exports = { app, runServer, closeServer };
