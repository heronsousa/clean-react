import { HttpPostClientSpy } from '@/data/test'
import { RemoteAuthentication } from './remote-authentication'
import { mockAccountModel, mockAuthentication } from '@/domain/test'
import { HttpStatusCode } from '@/data/protocols/http/http-response'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { faker } from '@faker-js/faker'

type SutTypes = {
    httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
    sut: RemoteAuthentication
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
    const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)

    return {
        sut,
        httpPostClientSpy
    }
}

describe('RemoteAuthentication', () => {
    test('Should call HttpPostClient with correct URL', async () => {
        const url = faker.internet.url()
        const { sut, httpPostClientSpy } = makeSut(url)

        await sut.auth(mockAuthentication())

        expect(httpPostClientSpy.url).toBe(url)
    })

    test('Should call HttpPostClient with correct body', async () => {
        const authenticationParams = mockAuthentication()
        const { sut, httpPostClientSpy } = makeSut()

        await sut.auth(authenticationParams)

        expect(httpPostClientSpy.body).toEqual(authenticationParams)
    })

    test('Should throw InvalidCredentialsError HttpPostClient returns 401', async () => {
        const authenticationParams = mockAuthentication()
        const { sut, httpPostClientSpy } = makeSut()

        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.unathorized
        }

        const promise = sut.auth(authenticationParams)

        await expect(promise).rejects.toThrow(new InvalidCredentialsError())
    })

    test('Should throw Unexpectederror HttpPostClient returns 400', async () => {
        const authenticationParams = mockAuthentication()
        const { sut, httpPostClientSpy } = makeSut()

        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const promise = sut.auth(authenticationParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should throw Unexpectederror HttpPostClient returns 500', async () => {
        const authenticationParams = mockAuthentication()
        const { sut, httpPostClientSpy } = makeSut()

        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.serverError
        }

        const promise = sut.auth(authenticationParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should throw Unexpectederror HttpPostClient returns 404', async () => {
        const authenticationParams = mockAuthentication()
        const { sut, httpPostClientSpy } = makeSut()

        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.notFound
        }

        const promise = sut.auth(authenticationParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should return an AccountModel if HttpostClient returns 200', async () => {
        const authenticationParams = mockAuthentication()
        const { sut, httpPostClientSpy } = makeSut()
        const httpResult = mockAccountModel()

        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.ok,
            body: httpResult
        }

        const account = await sut.auth(authenticationParams)

        await expect(account).toEqual(httpResult)
    })
})
