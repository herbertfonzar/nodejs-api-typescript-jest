import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios'
import stormGlassWeather3HoursFixtures from '@test/fixtures/stormglass_weather_3.json'
import stormGlassNormalized3HoursFixtures from '@test/fixtures/stormglass-normalized_weather_3.json'

jest.mock('axios')

describe('StormGlass client', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    it('Should return the normalized forecast from the StormGlass service', async () => {        
        const lat = -33.792726;
        const lng = 151.289824

        mockedAxios.get.mockResolvedValue({data: stormGlassWeather3HoursFixtures})

        const stormGlass = new StormGlass(mockedAxios)
        const response = await stormGlass.fetchPoints(lat, lng)

        expect(response).toEqual(stormGlassNormalized3HoursFixtures)
    })

    it('should exclude incomplete data points', async() => {
        const lat = -33.792726
        const lng = 151.289824
        const incompleteResponse = {
            hours: [
                {
                    windDirection: {
                        noaa: 300,
                    },
                    time: '2020-04-26T00:00:00+00:00',
                }
            ]
        }
        mockedAxios.get.mockResolvedValue({data: incompleteResponse})
        const stormGlass = new StormGlass(mockedAxios)
        const response = await stormGlass.fetchPoints(lat, lng)

        expect(response).toEqual([])
    })

    it('should get a generic error from StormGlass service when the request fail before reaching the service', async() => {
        const lat = -33.792726
        const lng = 151.289824
        
        mockedAxios.get.mockRejectedValue({message: 'Network Error'})
        const stormGlass = new StormGlass(mockedAxios)

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow('Unexpected error when trying to communitcate to StormGlass: Network Error')
    })

    it('should get a generic error from StormGlass service when responds with error', async() => {
        const lat = -33.792726
        const lng = 151.289824
        
        mockedAxios.get.mockRejectedValue({
            response: {
                status: 429,
                data: {errors: ['Rate Limit reached']}
            }
        })

        const stormGlass = new StormGlass(mockedAxios)

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow('Unexpected error returned by the StormGlass service: Error {"errors":["Rate Limit reached"]} Code: 429')
    })

})