let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Se hace la colección de la base de colección de estudiante
let commentCollection = mongoose.Schema({
    id:         {type : String, required : true, unique: true},
    titulo:     {type : String, required : true},
    contenido:  {type : String, required : true},
    autor:      {type : String, required : true},
    fecha:      {type : String, required : true}
});

let Comment = mongoose.model('comments', commentCollection);

let CommentList = {
    getAll : function(){
        return Comment.find()
        .then( comments => {
            return comments;
        })
        .catch( error => {
            throw Error(error);
        });
    },
    findById: function(id) {
        return Comment.findOne( {id: id} )
        .then( comment => {
            return comment;
        })
        .catch( error => {
            throw Error(error);
        })
    },
    getAllByAuthor: function(author) {
        return Comment.find( {autor: author} )
        .then( comments => {
            return comments;
        })
        .catch( error => {
            throw Error(error);
        })
    },
    addComment : function(newComment) { 
        return Comment.create(newComment)
            .then( addedComment => {
                return addedComment;
            })
            .catch( error => {
                throw Error(error);
            });
     },
     updateComment: function(id, data) {
        return Comment.findOneAndUpdate({id: id}, data)
        .then( Comment => {
            return Comment;
        })
        .catch( error => {
            throw Error(error);
        });
     },
     deleteComment: function(id) {
         return Comment.findOneAndDelete( {id: id} )
         .then( Comment => {
            return Comment;
         })
         .catch( error => {
             throw Error(error);
         });
     }
};

module.exports = {
    CommentList
};

