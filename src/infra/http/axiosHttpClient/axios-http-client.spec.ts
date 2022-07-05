import { AxiosHttpClient } from './axios-http-client'
import { faker } from '@faker-js/faker'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('AxiosHttpClient', () => {
    test('Should call axios with correct URL', async () => {
        const url = faker.internet.url()
        const sut = new AxiosHttpClient()

        await sut.post({ url })
        expect(mockedAxios).toHaveBeenCalledWith(url)
    })
})