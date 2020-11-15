import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        surname: {type: String, required: true},
        patronymic: {type: String},
        email: {type: String, required: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, required: true, default: false},
        deliveryAddress: {
            address: {type: String},
            city: {type: String},
            country: {type: String},
            postCode: {type: String},
        }
    },{
        timestamps: true
    }
)

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next){
    if(!this.isModified('password')){next()}

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User