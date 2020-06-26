const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var rolesValid = {
    values:[
        'ADMIN_ROLE',
        'USER_ROLE'
    ],
    message:'{VALUE} Mo es un rol valido'
}
const userSchema = new Schema({
    name: {type: String, required: [true, 'El nombre Es obligatorio']},
    email: {type: String, unique:true,required: [true, 'El email Es obligatorio']},
    password: {type: String, required: [true, 'El password Es obligatorio']},
    img: {type: String, required: false},
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValid}
});
userSchema.plugin(uniqueValidator,{message:'El {PATH} debe Ser unico'});
module.exports = mongoose.model('User',userSchema);
