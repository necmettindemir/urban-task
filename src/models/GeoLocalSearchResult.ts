import * as ENUMS from '../definitions/enums'
import { GeoLocalSearchLocation } from './GeoLocalSearchLocation';


export class GeoLocalSearchResult
{
    status      : string = ENUMS.EnumGeoSearchStatus.UNDEFINED;
    search      : string = '';
    location?   : GeoLocalSearchLocation;  

    constructor();
    constructor(status: string);
    
    constructor(status?: string) {
        this.status = status as string;        
    }          
}
