import { AccountModel } from '../models/account'

type AuthenticationParams = {
    email: string
    password: string
}

export interface Authentication {
    auth(params: AuthenticationParams): Promise<AccountModel>
}
