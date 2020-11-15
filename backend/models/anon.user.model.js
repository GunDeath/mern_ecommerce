import mongoose from 'mongoose'

const anonuserSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        surname: {type: String, required: true},
        patronymic: {type: String},
        email: {type: String, required: true}
    },{
        timestamps: true
    }
)

const Anonuser = mongoose.model('Anonuser', anonuserSchema)

export default Anonuser