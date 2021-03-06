import { Beach, BeachPosition } from "@src/models/beach";
import nock from 'nock'
import stormGlassWheather3HoursFixture from '@test/fixtures/stormglass_weather_3.json'
import apiForecastResponse1Beach from '@test/fixtures/api_forecast_response_1_beach.json'

describe('Beach forecast functional tests', () => {
  beforeEach(async () => {
    await Beach.deleteMany({})
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
    }
    const beach = new Beach(defaultBeach)
    await beach.save()
  })
  it('Should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true
      }
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: -33.792726,
        lng: 151.289824,
        params: /(.*)/,
        source: 'noaa',
      })
      .reply(200, stormGlassWheather3HoursFixture);
    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1Beach);
  });
  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v1/weather/point')
      .query({ lat: '-33.792726', lng: '151.289824' })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.get(`/forecast`);

    expect(status).toBe(500);
  });
});
