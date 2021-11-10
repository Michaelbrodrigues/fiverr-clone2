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
        origin: ["http://127.0.0.1:5500", "http://127.0.0.1:8000"],
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

require('./app/routes/auth.routes')(app);
// require('./app/routes/product.routes')(app);
// require('./app/routes/warehouse.routes')(app);
// require('./app/routes/cart.routes')(app);
// require('./app/routes/skill.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/message.routes')(app);
require('./app/routes/service.routes')(app);
require('./app/routes/service-plan.routes')(app);
require('./app/routes/service-plan-feature.routes')(app);
require('./app/routes/purchasing.routes')(app);
require('./app/routes/payment.routes')(app);

let users = [];


const addUser = (UserId, SocketId) => {
	!users.some(user=>user.UserId === UserId ) &&
		users.push({
			UserId, SocketId
		});
};

const removeUser = (SocketId) => {
	users = users.filter((user) => user.SocketId !== SocketId);
}

const getUser = (UserId) => {
	return users.find(user => user.UserId === UserId)
}

const emitPreviewRecentMessges = (credentials) => {
	const user = getUser(`${credentials.UserId}`);
	const user2 = getUser(`${credentials.ToUserId}`);
	controller.readSocketPreviewMessage(credentials.UserId)
		.then((result) => io.to(user.SocketId).emit("preview message", result))
		.catch(console.log);

	controller.readSocketPreviewMessage(credentials.ToUserId)
		.then((result) => io.to(user2.SocketId).emit("preview message", result))
		.catch(console.log);
};

// sends out the 10 most recent messages from recent to oldest
const emitMostRecentMessges = (credentials) => {
	const user = getUser(`${credentials.ToUserId}`);
	const user2 = getUser(`${credentials.UserId}`);
	controller.readSocketMessage(credentials)
		.then((result) => {
			io.to(user.SocketId).to(user2.SocketId).emit("chat message", result)
		})
		.catch(console.log);
};

// connects, creates message, and emits top 10 messages
io.on("connection", (socket) => {
    console.log("a user connected!");

	socket.on('addUser', UserId => {
		addUser(UserId, socket.id);
		io.emit('getUsers', users);
	})

    socket.on('send message', (msg) => {
		let credentials = JSON.parse(msg);
		const user = getUser(`${credentials.ToUserId}`);
		const user2 = getUser(`${credentials.UserId}`);

		socket.join(user.SocketId);
        controller.createSocketMessage(JSON.parse(msg))
            .then((res) => {
				console.log(res);
                // emitMostRecentMessges(JSON.parse(msg));
				controller.readSocketMessage(credentials)
					.then((result) => {
						io.to(user.SocketId).emit("chat message", result)
					})
					.catch(console.log);
            })
            .catch((err) => console.log(err));
    });

	socket.on('preview message', (msg) => {
		emitPreviewRecentMessges(JSON.parse(msg));
	});

    // close event when user disconnects from app
    socket.on("disconnect", () => {
        console.log("user disconnected");
		removeUser(socket.id);
		console.log(users);
		io.emit('getUsers', users);

    });
});

//Inisiasi port yang akan dipakai
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})