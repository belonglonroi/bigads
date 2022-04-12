export class LoginParam {
    phone: string;
    password: string;
    remember?: boolean;
}

export class LoginResult {
    phone: string;
    accessToken: string;
    expiresIn: string;
    sessionId: string;
}
