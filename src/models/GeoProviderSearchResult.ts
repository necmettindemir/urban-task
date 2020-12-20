import * as ENUMS from '../definitions/enums'

export class GeoProviderSearchResult
{
    status          : string = ENUMS.EnumGeoSearchStatus.UNDEFINED;
    search          : string = '';    
    providerGeoData : any;
    lat             : number = 0.0;
    lng             : number = 0.0;

    constructor();
    constructor(status: string);
    
    constructor(status?: string) {
        this.status = status as string;        
    }          
}
