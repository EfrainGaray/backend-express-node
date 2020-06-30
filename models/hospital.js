const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    name: {type: String, required: [true, 'El	nombre	es	necesario']},
    img: {type: String, required: false},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    },
    {
    collection: 'hospitals'
});

module.exports =	mongoose.model('Hospital',	hospitalSchema);