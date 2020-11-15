import bcrypt from 'bcrypt'

const users = [
    {
        name: 'Phlipp',
        surname: 'Bulyga',
        email: 'phillbleck@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Jane',
        surname: 'Doe',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
]

export default users