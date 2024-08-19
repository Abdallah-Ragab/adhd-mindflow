import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import { verify } from 'crypto'

// Define the extension
const passwordExtension = Prisma.defineExtension({
    name: 'Password Encryption Extension',

    result: {
        user: {
            verifyPassword: {
                needs: {password: true},
                compute: (user) => {
                    return function (password: string) {
                        return comparePassword(password, user?.password ?? '')
                      };
                }
            }
        }
    },
    query: {
        user: {
            $allOperations({ model, operation, args, query }) {
                if (['create', 'update'].includes(operation)) {
                    if (args.hasOwnProperty('data')) {
                        if (args.data.hasOwnProperty('password')) {
                            args.data.password = hashPassword(args.data.password)
                        }
                    }
                }
                return query(args)
            },
        },
    }
}
)

const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, 10)
}
const comparePassword = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash)
}

export { passwordExtension, hashPassword, comparePassword }