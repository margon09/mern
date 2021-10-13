const { Schema, model, Types } = require('mongoose')

// creating schema
const schema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	// it is just a connection between UserModel and DB; ref: 'Link' is to which model we bind
	links: [{ type: Types.ObjectId, ref: 'Link' }]
})

// we export the result of the function model(), and the schema it work with is - 'schema'
module.exports = model('User', schema)
