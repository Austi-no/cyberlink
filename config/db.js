const crypto = require("crypto").randomBytes(256).toString("hex");

module.exports = { // url: "mongodb://localhost:27017/BlogDB",
    url: "mongodb+srv://Austino1228:Austino@1228@mean-stack-blog.ezudj.mongodb.net/cyberlinkdb?retryWrites=true&w=majority",
    secret: crypto,
    db: "BlogDB"
};
