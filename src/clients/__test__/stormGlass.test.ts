import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios'
import stormGlassWeather3HoursFixtures from '@test/fixtures/stormglass_weather_3.json'
import stormGlassNormalized3HoursFixtures from '@test/fixtures/stormglass-normalized_weather_3.json'

jest.mock('axios')

describe('StormGlass client', () => {
    it('Should return the normalized forecast from the StormGlass service', async () => {
        const lat = -33.792726;
        const lng = 151.289824

        axios.get = jest.fn().mockResolvedValue(stormGlassWeather3HoursFixtures)

        const stormGlass = new StormGlass(axios)
        const response = await stormGlass.fetchPoints(lat, lng)

        expect(response).toEqual(stormGlassNormalized3HoursFixtures)
    })
})