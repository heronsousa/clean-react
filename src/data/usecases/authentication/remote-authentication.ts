import { AuthenticationParams } from '@/domain/usecases/authentication'
import { HttpPostClient } from '@/data/protocols/http/http-post-client'
import { HttpStatusCode } from '@/data/protocols/http/http-response'
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error'
import { UnexpectedError } from '@/domain/errors/unexpected-error'
import { AccountModel } from '@/domain/models/account'

export class RemoteAuthentication {
    constructor(
        private readonly url: string,
        private readonly httpPostClient: HttpPostClient<AuthenticationParams, AccountModel>
    ) { }

    async auth(params: AuthenticationParams): Promise<void> {
        const httpRespponse = await this.httpPostClient.post({
            url: this.url,
            body: params
        })

        switch (httpRespponse.statusCode) {
            case HttpStatusCode.ok:
                break

            case HttpStatusCode.unathorized:
                throw new InvalidCredentialsError()

            default:
                throw new UnexpectedError()
        }
    }
}
