const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql")
const port = 8000;
const fs = require("fs");

app.use(express.static(path.join(__dirname, "src")));

//mysql connection
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "gow_db"
});

// Trying to connect to above db using the provided credentials
db.connect((err) => {
    if (err) {
        console.error("Database connection failed", err.stack)
    }
    else {
        console.log("Database connection established")
    }
});
// Route to display home page originally
app.get("/", (req, res) => {
    homepath = path.join(__dirname, "src", "home.html")
    res.sendFile(homepath)
});
console.log("__dirname:", __dirname);
console.log("Resolved path:", path.join(__dirname, "src", "home.html"));
// Route to display home page from online
// app.get("/", (req, res) => {
//     res.sendFile("home.html", { root: path.join(__dirname, "src") })
// });

// Route to display hardware data
app.get("/requirements", (req, res) => {
    db.query("select * from god_of_war_system_requirements", (err, data) => {
        if (err) {
            res.send("error fetching the data")
            return
        }
        var table = `
        <h4 style="text-align:center";>GOW Hardware Requirements</h4>
        <table style="width:50%; margin: auto;" border="1" cellpadding="15">
        <tr>
        <th>ID</th>
        <th>Requirement Level</th>
        <th>OS</th>
        <th>Processor</th>
        <th>Memory</th>
        <th>Graphics Card</th>
        <th>Storage</th>
        <th>Additional Notes</th>
        </tr>
        `
        data.forEach((row) => {
            table += `
            <tr>
            <td>${row.id}</td>
            <td>${row.requirement_level}</td>
            <td>${row.os}</td>
            <td>${row.processor}</td>
            <td>${row.memory}</td>
            <td>${row.graphics_card}</td>
            <td>${row.storage}</td>
            <td>${row.additional_notes}</td>
            </tr>
            `
        });

        table += `</table>`
        filepath = path.join(__dirname, 'src', 'requirements.html')
        fs.readFile(filepath, "utf8", (err, html_code) => {
            if (err) {
                console.error("error reading file", err);
                res.status(500).send("error reading file");
                return;
            }

            const modifiedhtml = html_code.replace("<!-- table code -->", table);
            res.send(modifiedhtml);
        });
    });
});
app.listen(port, () => {
    console.log("Server has started at http://localhost:8000/")
})