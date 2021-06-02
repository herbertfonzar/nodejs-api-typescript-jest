import { AxiosStatic } from "axios";

export class StormGlass {
    constructor(protected request: AxiosStatic) {}
    public async fetchPoints(lat: number, lng: number): Promise<any> {
        return this.request.get('https://api.stormglass.io/v2')        
    }
}