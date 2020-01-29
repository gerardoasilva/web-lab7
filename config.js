// mongodb://localhost/blog
// mongodb+srv://universityuser:universityuser@cluster0-xilgz.mongodb.net/university?retryWrites=true&w=majority
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://bloguser:bloguser@cluster0-xilgz.mongodb.net/blog?retryWrites=true&w=majority";
exports.PORT = process.env.PORT || 8080; 