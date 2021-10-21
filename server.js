const express = require('express');
const bodyParser = require('body-parser');

const controller = require('./app/controllers/message.controller');

const cors = require("cors");

const {
    emit
} = require("process");


//Memanggil model
const db = require('./app/models');

//Deklarasi express.js
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
    },
});
app.use(cors());

const bcrypt = require("bcrypt");

app.use(bodyParser.json());

// app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));

// Migrasi tabel yang ada dalam setiap model
db.sequelize.sync({ force: false });

//Inisasi routing pada halaman awal
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Fiverr Clone App!"
    });
});

//Membuat migrasi role dan user
app.post('/migration', (req, res) => {
    const db = require('./app/models');
    const User = db.user;
    const Role = db.role;
    const Category = db.category;

    const role = {
        roleName: "Admin"
    }

    Role.create(role)
        .then((data) => {
            const hashedPassword = bcrypt.hashSync("password", 10);
            const user = {
                id: "_usrbtjgkj2d9",
                fullName: "Gilang Chandra Syahputra",
                username: "gilangcsy",
                email: "gilangchandra9@gmail.com",
                password: hashedPassword,
                RoleId: 1
            }
            const category = {
                name: "Logo Design",
                group: "Logo & Brand Design"
            }

            User.create(user)
                .then((data) => {
                    Category.create(category)
                        .then(result => {
                            res.status(200).send({
                                message:"Success!"
                            });
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message || 'Some error occured while creating user.'
                            });
                        })
                }).catch((err) => {
                    res.status(500).send({
                        message: err.message || 'Some error occured while creating user.'
                    })
                })
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating user.'
            })
        })
});


app.use('/uploads', express.static('uploads'));

// require('./app/routes/auth.routes')(app);
// require('./app/routes/product.routes')(app);
// require('./app/routes/warehouse.routes')(app);
// require('./app/routes/cart.routes')(app);
// require('./app/routes/skill.routes')(app);
// require('./app/routes/map.routes')(app);
require('./app/routes/message.routes')(app);
require('./app/routes/service.routes')(app);
require('./app/routes/service-plan.routes')(app);
require('./app/routes/purchasing.routes')(app);
require('./app/routes/payment.routes')(app);

// sends out the 10 most recent messages from recent to oldest
// const emitMostRecentMessges = () => {
//     controller.readSocketMessage()
//         .then((result) => io.emit("chat message", result))
//         .catch(console.log);
// };

// connects, creates message, and emits top 10 messages
// io.on("connection", (socket) => {
//     console.log("a user connected!");
//     socket.on('chat message', (msg) => {
//         controller.createSocketMessage(JSON.parse(msg))
//             .then(() => {
//                 emitMostRecentMessges();
//             })
//             .catch((err) => console.log(err));
//     });
//     // close event when user disconnects from app
//     socket.on("disconnect", () => {
//         console.log("user disconnected");
//     });
// });

//Inisiasi port yang akan dipakai
const PORT = 8000;

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})