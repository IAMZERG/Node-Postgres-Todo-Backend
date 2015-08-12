var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:wrightw487@localhost:5432/todo';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/v1/todos', function (req, res) {
        var results = [];
        var data = {text: req.body.todo.text, complete: req.body.todo.complete};
        console.log(req.body.todo.text);

        pg.connect(connectionString, function (err, client, done) {
                client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

                var query = client.query("SELECT * FROM items ORDER BY id ASC;");

                query.on('row', function(row) {
                        results.push(row);
                });

                query.on('end', function () {
                        client.end();
                        return res.json(results);
                });

                if(err) {
                        console.log(err);
                }
        });
});

router.get('/api/v1/todos', function( req, res) {

        var results = [];

        pg.connect(connectionString, function (err, client, done) {
                var query = client.query("SELECT * FROM items ORDER BY id ASC;");

                query.on('row', function (row) {
                        results.push(row);
                        console.log(row);
                });
                query.on('end', function () {
                        client.end();
                        console.log(results);
                        return res.json({"todo": results});
                });
                if (err) {
                        console.log(err);
                }
        });
});
router.put('/api/v1/todos/:todo_id', function (req, res) {

        var results = [];

        var id = req.params.todo_id;

        var data = {text: req.body.todo.text, complete: req.body.todo.complete};
        console.log(id + "was the id and "+ req.body "is the body of the response");

        pg.connect(connectionString, function (err, client, done) {
                client.query("UPDATE items SET text=($1), complete=($2) WHERE id =($3);", [data.text, data.complete, id]);

                var query = client.query("SELECT * FROM items ORDER BY id ASC;");

                query.on('row', function(row) {
                        results.push(row);
                });

                query.on('end', function(row) {
                        results.push(row);
                        return res.json(results);
                });

                if (err) {
                        console.log(err);
                }
        });
});

router.delete('/api/v1/todos/:todo_id', function (req, res) {
        var results = [];

        var id = req.params.todo_id;
        console.log(id);

        pg.connect(connectionString, function (err, client, done) {
                client.query("DELETE FROM items WHERE id=($1)", [id]);

                var query = client.query("SELECT * FROM items ORDER BY id ASC");

                query.on('row', function (row) {
                        results.push(row);
                });
                query.on('end', function () {
                        client.end();
                        return res.json(results);
                });
                if (err) {
                        console.log(err);
                }
        });
});

module.exports = router;

