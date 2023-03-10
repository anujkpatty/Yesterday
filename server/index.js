const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
var fs = require('fs');
const cors = require('cors');
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
const { randomUUID } = require('crypto');
const { makeGif } = require('./gifMaker')
const path = require('path')


var sqlite3 = require("sqlite3");

const { URLSearchParams } = require("url");
const { clear } = require("console");


const DBSOURCE = "usersdb.sqlite";

var db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } 
    else {
        // ** EXAMPLE **
        // ** For a column with unique values **
        // email TEXT UNIQUE, 
        // with CONSTRAINT email_unique UNIQUE (email)   

        db.run(`CREATE TABLE Images (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Path TEXT,
            Post INTEGER
            )`, (err) => {
                if (err) {
                    //console.log(err)
                }
            });
        db.run(`CREATE TABLE Users (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Username TEXT UNIQUE,
            Password TEXT,
            Path TEXT
            )`, (err) => {
                if (err) {
                    //console.log(err)
                }
            });
        db.run(`CREATE TABLE Posts (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            User TEXT,
            Path TEXT,
            Status INTEGER,
            Date TEXT
            )`, (err) => {
                if (err) {
                    //console.log(err)
                }
            });
        db.run(`CREATE TABLE Friends (
            User_one TEXT,
            User_two TEXT,
            Status INTEGER
            )`, (err) => {
                if (err) {
                    //console.log(err)
                }
            });
    }
})


module.exports = db

app.use(
    express.urlencoded({ extended: false }),
    cors(),
    express.json(),
);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0]);
    },
  });

const profile_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'profile-pictures');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0]);
    },
});

const upload = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 }});

const profile_upload = multer({ storage: profile_storage, limits: { fieldSize: 25 * 1024 * 1024 }});


app.post('/upload', upload.array('images'), function (req, res, next) {
    var insert = 'REPLACE INTO Images (Path) VALUES (?)'

    for (let i = 0; i < req.files.length; i++) {
        db.run(insert, [req.files[i].path])
    }
    res.status(200).end('Your files uploaded.');
})

app.post('/upload_single', upload.single('image'), function (req, res, next) {
    var insert = 'REPLACE INTO Images (Path, Post) VALUES (?, ?)'

    db.run(insert, [req.file.path, req.body.postid])
    
    res.status(200).end('Your file uploaded.');
})

app.post('/profile_picture', profile_upload.single('image'), function (req, res, next) {

    const user = req.query.user
    const sql = 'SELECT Path FROM Users WHERE Username = ?'

    db.get(sql, [user], (err, row) => {
        if (err) {
            console.log(err)
        } else {
            if (row.Path != './profile-pictures/default-user.png') {
                fs.unlink(row.Path, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('file deleted')
                    }
                })
            }
        }
    })

    var insert = 'UPDATE Users SET Path = ? WHERE Username = ?'

    db.run(insert, [req.file.path, user])
    
    res.status(200).end('Your file uploaded.');
})


app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    

    const sql = `SELECT * FROM Users WHERE Username = ? AND Password = ?`

    db.get(sql, [username, password], (err, row) => {
        if (err) {
            res.status(404).end('Account or password invalid')
        } else if (!row) {
            res.status(404).end('Account or password invalid')
        } else {
            res.json({user: row.Username})
        }
    })
})

app.post('/register', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (username && password) {
        const sql = `INSERT INTO Users (Username, Password, Path) VALUES (?, ?, './profile-pictures/default-user.png')`

        db.run(sql, [username, password], (err) => {
            if (err) {
                res.status(404).end('User already exists')
            } else {
                res.json({user: username})
            }
        })
    } else {
        res.status(404)
    }

    
})

function deletePostAndFiles(user, status, date) {

    let sql = 'SELECT * FROM Posts WHERE User = ? AND Status = ?'

    db.get(sql, [user, status], (err, row) => {
        if (err) {
            console.log(err)
        } else {
            if (row) {

                let imgs_sql = 'SELECT * FROM Images WHERE Post = ?'
                db.all(imgs_sql, [row.Id], (err, rows) => {
                    if (err) {
                        console.log(err)
                    } else {
                        rows.forEach(row => {
                            fs.unlink(row.Path, (err) => {
                                if (err) console.log(err)
                            })
                        })
                        db.run('DELETE FROM Images WHERE Post = ?', [row.Id], (err) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                    
                })

                fs.unlink(row.Path, (err) => {
                    if (err) console.log(err)
                })

                sql = 'DELETE FROM Posts WHERE Id = ?'
                db.run(sql, [row.Id], (err) => {
                    if (err) {
                        console.log(err)
                    } 
                })
            }
        }
    })
}

app.post('/create_post', (req, res) => {
    const user = req.body.user

    let date = new Date();
    date = date.toISOString().split('T')[0];

    deletePostAndFiles(user, 0, '')

    
    sql = 'INSERT INTO Posts (User, Status, Date) VALUES (?, 0, ?)'
    db.run(sql, [user, date], (err) => {
        if (err) {
            console.log(err)
        } else {
            db.get('SELECT Id id FROM Posts WHERE User = ? AND Status = 0', [user], (err, row2) => {
                if (err) {
                    console.log(err)
                } else {
                    res.json({postid: row2.id})
                }
            })
        }
    })
})




app.get('/:id/image', (req, res) => {

    const sql = `SELECT Path path FROM Images WHERE Id = ?`
    
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            console.error(err.message)
        } else {
            fs.readFile(row.path, function(err, data) {
                res.set('Content-Type', 'image/png')
                res.send(data);
            });
        }
    })
})

app.get('/make_gif', (req, res) => {
    const sql = `SELECT Path path FROM Images WHERE Post = ?`
    let image_paths = []
    const postid = req.query.postid

    db.all(sql, [postid], async (err, rows) => {
        if (err) {
            console.error(err.message)
        } else {
            let i = 0
            rows.forEach((row) => {
                image_paths[i] = row.path
                i += 1
            })
            const output = path.join(__dirname, `/gifs/${postid}.gif`)
            makeGif(image_paths, output)
            const query = 'UPDATE Posts SET Path = ? WHERE Id = ?'
            db.run(query, [output, postid], (err) => {
                if (err) {
                    console.log(err)
                } else {
                    res.sendStatus(200)
                }
            })
        }
    })
})

app.get('/gif', (req, res) => {
    const user = req.query.user
    const status = req.query.status
    const id = req.query.id
    const sql = 'SELECT Path path FROM Posts WHERE User = ? AND Status = ?'

    if (id) {
        const sql = 'SELECT Path FROM Posts WHERE Id = ?'

        db.get(sql, [id], (err, row) => {
            if (err) {
                console.log(err)
            } else {
                let path = row.Path
                fs.readFile(path, function(err, data) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.set('Content-Type', 'image/gif')
                        res.send(data);
                    }
                });
            }
        })
    } else if (!user || !status) {
        res.sendStatus(404)
    } else {
        db.get(sql, [user, status], (err, row) => {
            if (err) {
                console.log(err);
            } else if (!row) {
                res.sendStatus(404)
            } else {
                let path = row.path
                fs.readFile(path, function(err, data) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.set('Content-Type', 'image/gif')
                        res.send(data);
                    }
                    
                });
            }
        })
    }
}) 

app.get('/profile_picture', (req, res) => {
    const user = req.query.user
    const sql = 'SELECT Path path FROM Users WHERE Username = ?'

    if (!user) {
        res.sendStatus(404)
    } else {
        db.get(sql, [user], (err, row) => {
            if (err) {
                console.log(err)
            } else if (!row) {
                res.sendStatus(404)
            } else {
                let path = row.path
                fs.readFile(path, function(err, data) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.set('Content-Type', 'image/gif')
                        res.send(data)
                    }
                })
            }
        })
    }
})

app.post('/add_friend', (req, res) => {
    const user_one = req.body.user_one
    const user_two = req.body.user_two
    const sql = 'REPLACE INTO Friends (User_one, User_two, Status) VALUES (?, ?, ?)'

    db.run(sql, [user_one, user_two, 0], (err) => {
        if (err) {
            console.log(err)
        } 
    })

    db.run(sql, [user_two, user_one, 1], (err) => {
        if (err) {
            console.log(err)
        } 
    })

    res.sendStatus(200)

})

app.put('/remove_friend', (req, res) => {
    const user_one = req.body.user_one
    const user_two = req.body.user_two
    const sql = 'DELETE FROM Friends WHERE User_one = ? AND User_two = ? AND (Status = 0 OR Status = 1 OR Status = 2)'

    db.run(sql, [user_one, user_two], (err) => {
        if (err) {
            console.log(err)
        }
    })

    db.run(sql, [user_two, user_one], (err) => {
        if (err) {
            console.log(err)
        } 
    })

    res.sendStatus(200)
})

app.put('/post', (req, res) => {
    const status = req.body.status
    const user = req.body.user
    deletePostAndFiles(user, status, '')
})

app.get('/relation', (req, res) => {
    const user_1 = req.query.user_1
    const user_2 = req.query.user_2
    const sql = `SELECT * FROM Friends WHERE (User_one = ? AND User_two = ?)`

    db.get(sql, [user_1, user_2], (err, row) => {
        if (err) {
            console.log(err)
        } else {
            if (row) {
                res.send({
                    relation: row.Status,
                    user_1: row.User_one,
                    user_2: row.user_two,
                })
            } else {
                res.send({relation: 3})
            }
        }
    })
})

app.get('/search', (req, res) => {
    const search = req.query.search
    const curUser = req.query.user
    if (!search) {
        res.send([])
    } else {
        const sql =`SELECT Username FROM Users WHERE Username LIKE '${search}%' LIMIT 10`
        db.all(sql, (err, rows) => {
            if (err) {
                console.log(err)
            } else {
                let arr = []
                rows.forEach(row => {
                    if (row.Username != curUser) {
                        arr.push(row.Username)
                    }
                })
                res.send(arr)
            }
            
        })
    }

})

app.get('/requests', (req, res) => {
    const user = req.query.user
    const sql = 'SELECT User_two FROM Friends WHERE User_one = ? AND Status = 1'

    db.all(sql, [user], (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            let arr = []
            rows.forEach(row => {
                arr.push(row.User_two)
            })
            res.send(arr)
        }
    })
})

app.put('/accept', (req, res) => {
    const user_one = req.body.user_one
    const user_two = req.body.user_two
    const sql = 'UPDATE Friends SET Status = 2 WHERE User_one = ? AND User_two = ?'

    db.run(sql, [user_one, user_two], (err) => {
        if (err) {
            console.log(err)
        }
    })

    db.run(sql, [user_two, user_one], (err) => {
        if (err) {
            console.log(err)
        }
    })

    res.sendStatus(200)
})

app.get('/feed', (req, res) => {
    const user = req.query.user

    const sql = 'SELECT * FROM Posts WHERE Status = 1 AND User IN (SELECT User_two FROM Friends WHERE User_one = ? AND Status = 2)'

    db.all(sql, [user], (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            let arr = []
            rows.forEach(row => arr.push(row.User))
            res.send(arr)
        }
    })
})

app.get('/post_status', (req, res) => {
    const user = req.query.user
    const sql = 'SELECT Status FROM Posts WHERE User = ?'

    db.all(sql, [user], (err, rows) => {
        if (err) {
            res.sendStatus(404)
        } else {
            if (rows) {
                data = {today: 0, yesterday: 0}
                rows.forEach((row) => {
                    if (row.Status == 0) {
                        data.today = 1
                    }
                    if (row.Status == 1) {
                        data.yesterday = 1
                    }
                })
                res.send(data)
            } else {
                res.sendStatus(200)
            }
            
        }
    })
})

app.get('/:user/posts', (req, res) => {
    const user = req.params.user
    const sql = `SELECT Id, Date FROM Posts WHERE User = ? AND (Status = 2 OR Status = 1)`

    db.all(sql, [user], (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            data = []
            rows.forEach((row) => {
                data.push({id: row.Id, date: row.Date})
            })
            res.send(data)
        }
    })
})

function clear_posts() {
    let sql = 'UPDATE Posts SET Status = 2 WHERE Status = 1'
    db.all(sql, (err) => {
        if (err) {
            console.log(err)
        } else {
            sql = 'UPDATE Posts SET Status = 1 WHERE Status = 0'
            db.all(sql, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
    })
}

var now = new Date();
var mil_to_12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 33, 0, 0) - now;
if (mil_to_12 < 0) {
     mil_to_12 += 86400000; // it's after 10am, try 10am tomorrow.
}
setTimeout(() => {
    clear_posts()
    setInterval(clear_posts, 1000 * 60 * 60 * 24)
}, mil_to_12)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

