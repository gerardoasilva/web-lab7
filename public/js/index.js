function displayComments() {
  $.ajax({
    type: "GET",
    url: "/blog-api/comentarios",
    dataType: "json",
    success: response => {
      $("#listaComentarios").empty();
      response.forEach(elemento => {
        $("#listaComentarios").append(`
                    <div class="card mb-2 rounded-lg border border-secondary">
                        <h3 class="card-header"> ${elemento.autor} </h3>
                        <div class="card-body">
                            <h5 class="card-title">${elemento.titulo}</h5>
                            <p class="card-text">${elemento.contenido}</p>
                            <p class="card-text text-right">Publicado el: ${elemento.fecha}</p>
                            <small class="text-muted">ID: ${elemento.id} </small>
                        </div>
                    </div>
                `);
      });
    },
    error: err => {
      console.log(err);
    }
  });
}

function watchFormAgregar() {
  $("#formAgregar").submit(function(e) {
    e.preventDefault();
    let titulo = $("#tituloAgregar").val();
    let contenido = $("#contenidoAgregar").val();
    let autor = $("#autorAgregar").val();

    $.ajax({
      type: "POST",
      url: "/blog-api/nuevo-comentario",
      contentType: "application/json",
      data: JSON.stringify({ titulo, contenido, autor }),
      dataType: "json",
      success: function(response) {
        location.reload();
      },
      error: function ({status, statusText}) {
          alert('Error '+status+': '+statusText);
      }
    });
  });
}

function watchFormModificar() {
  $("#formModificar").submit(function(e) {
    e.preventDefault();
    let id = $("#idModificar").val();
    let titulo = $("#tituloModificar").val();
    let contenido = $("#contenidoModificar").val();
    let autor = $("#autorModificar").val();

    $.ajax({
      type: "PUT",
      url: "/blog-api/actualizar-comentario/" + id,
      contentType: "application/json",
      data: JSON.stringify({ id, titulo, contenido, autor }),
      dataType: "json",
      success: function(response) {
        location.reload();
      },
      error: function({ status, statusText }) {
        alert("Error " + status + ": " + statusText);
      }
    });
  });
}

function watchFormEliminar() {
    $("#formEliminar").submit(function(e) {
      e.preventDefault();
      let id = $("#idEliminar").val();
  
      $.ajax({
        type: "DELETE",
        url: "/blog-api/remover-comentario/" + id,
        success: function(response) {
          location.reload();
        },
        error: function({ status, statusText }) {
          alert("Error " + status + ": " + statusText);
        }
      });
    });
  }

  function watchFormBuscar() {
    $("#formBuscar").submit(function(e) {
      e.preventDefault();
      let autor = $("#autorBuscar").val();
  
      $.ajax({
        type: "GET",
        url: "/blog-api/comentarios-por-autor?autor=" + autor,
        dataType: "json",
        success: function(response) {
            $("#comentariosPorAutor").empty();
            $('#creador').empty();
          response.forEach(elemento => {
            
            $('#creador').text("de "+autor);
            $("#comentariosPorAutor").append(`
                <div class="card mb-2 rounded-lg border border-secondary">
                    <h3 class="card-header"> ${elemento.autor} </h3>
                    <div class="card-body">
                        <h5 class="card-title">${elemento.titulo}</h5>
                        <p class="card-text">${elemento.contenido}</p>
                        <p class="card-text text-right">Publicado el: ${elemento.fecha}</p>
                        <small class="text-muted">ID: ${elemento.id} </small>
                    </div>
                </div>
            `);
          });
        },
        error: function({ status, statusText }) {
          alert("Error " + status + ": " + statusText);
        }
      });
    });
  }

function init() {
  displayComments();
  watchFormAgregar();
  watchFormModificar();
  watchFormEliminar();
  watchFormBuscar();
}

init();


