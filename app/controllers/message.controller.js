const db = require('../models');
const Message = db.message;
const Op = db.Sequelize.Op;
const sequelize = require('sequelize')
const {
	QueryTypes
} = require('sequelize');


exports.create = (req, res) => {
    const message = {
        id: '_' + Math.random().toString(36).substr(2, 9),
        text: req.body.text,
        UserId: req.body.UserId,
    }

    Message.create(message)
        .then((data) => {
            res.send(data)
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the message.'
            })
        })
}

exports.read = (req, res) => {
	const id = req.params.id;
	const ids = req.params.ids;

	const isReaded = req.query.isReaded;
    Message.findAll({
		// attributes: [
		// 	[db.Sequelize.fn("DISTINCT", db.Sequelize.col("UserId")), "UserId"],
		// ],
		where: {
			isReaded: isReaded,
			[Op.or]: [
				{
					UserId: ids,
					ToUserId: id
				},
				{
					UserId: id,
					ToUserId: ids
				},
			]
		},
		include: {
			model: db.user
		},
		order: [
			[
				'createdAt', 'ASC'
			]
		]
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "There is a problem in the server."
        })
    })
}

exports.preview = (req, res) => {
	const {
		id
	} = req.params;

	db.sequelize.query(`select * from (select "Message".*, row_number() over (partition by "Message"."groupId" ORDER BY "Message"."createdAt" DESC) as row_number from "Message" LEFT OUTER JOIN "User" AS "User" ON "Message"."UserId" = "User"."id" WHERE "Message"."ToUserId" = '${id}' OR "Message"."UserId" = '${id}' ORDER BY "Message"."createdAt" DESC) as rows where row_number = 1`, {
			type: QueryTypes.SELECT
		})
		.then((data) => {
			res.send(data);
		}).catch((err) => {
			res.status(500).send({
				message: err.message || "Some error occured."
			});
		});
}

exports.readSocketPreviewMessage = (credentials) => {
	return new Promise((resolve, reject) => {
		db.sequelize.query(`select * from (select "Message".*, row_number() over (partition by "Message"."groupId" ORDER BY "Message"."createdAt" DESC) as row_number from "Message" LEFT OUTER JOIN "User" AS "User" ON "Message"."UserId" = "User"."id" WHERE "Message"."ToUserId" = '${credentials}' OR "Message"."UserId" = '${credentials}' ORDER BY "Message"."createdAt" DESC) as rows where row_number = 1`, {
			type: QueryTypes.SELECT
		})
		.then((data) => {
			resolve(data);
		}).catch((err) => {
			reject({
				message: err.message || "There is a problem in the server."
			})
		});
	});
}

exports.readSocketMessage = (credentials) => {
    return new Promise((resolve, reject) => {
        Message.findAll({
            where: {
            		[Op.or]: [
				{
					UserId: credentials.UserId,
					ToUserId: credentials.ToUserId
				},
				{
					UserId: credentials.ToUserId,
					ToUserId: credentials.UserId
				}
			]
            	},
            	include: {
            		model: db.user
            	},
            	order: [
            		[
            			'createdAt', 'ASC'
            		]
            	]
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject({
                message: err.message || "There is a problem in the server."
            })
        })
    });
}

exports.createSocketMessage = (message) => {
    const messageValue = {
        id: message.id,
		isReaded: message.isReaded,
        groupId: message.groupId,
        text: message.text,
        UserId: message.UserId,
        ToUserId: message.ToUserId,
    }
    return new Promise((resolve, reject) => {
        Message.create(messageValue)
            .then((data) => {
                resolve(data);
            }).catch((err) => {
                reject({
                    message: err.message || 'Some error occured while creating the message.'
                })
            })
    });
}