import { sign, verify } from 'jsonwebtoken';
import { User } from '@prisma/client';

const encodeToken = (user: User, duration:string = "1d") => {
    return sign(
        { id: user.id },
        process.env.JWT_SECRET ?? 'default-secret',
        {
            expiresIn: duration,
        }
    );
}

const decodeToken = (token: string) => {
    return verify(token, process.env.JWT_SECRET ?? 'default-secret');
}


const getPayload = (token: string) => {
    const decoded = decodeToken(token) as { id: number } | null;
    return decoded;
}

export { encodeToken, decodeToken, getPayload }