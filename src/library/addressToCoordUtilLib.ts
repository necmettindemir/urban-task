
import NodeGeocoder from 'node-geocoder';

import { GeoProviderSearchResult } from '../models/GeoProviderSearchResult';
import { GeoLocalSearchResult } from '../models/GeoLocalSearchResult';
import { GeoLocalSearchLocation } from '../models/GeoLocalSearchLocation';

import { EnumGeoSearchProvider, EnumGeoSearchStatus } from '../definitions/enums';
import { googleApiKEY } from '../definitions/defaultSettings';
import * as Messages from '../definitions/messages';



/*
Address to coordinate is a service that can be supplied by many providers as shown below.

'google' | 'geocodio' | 'freegeoip' |
'locationiq' | 'mapquest' | 'openmapquest' |
'tomtom' | 'nominatimmapquest' |
'opencage' | 'datasciencetoolkit' |
'yandex' | 'teleport' | 'pickpoint' | etc

Here, google implemention is done.
Other are left for future, it is possible to implement others accordingly.
*/


/* for knowloedge please have look at /src/readme/readme-google-geo-search.txt */



export const GetGeoCodeBySearchTerm = async (searchTerm:string, enumProvider:EnumGeoSearchProvider) => {
    
/*
Each provider may return different result geo data.
So, all are implemented  seperately
*/

    let geoProviderSearchResult = new  GeoProviderSearchResult();

    switch (enumProvider) {

        case EnumGeoSearchProvider.GOOGLE:
            
            geoProviderSearchResult = await GetGeoCodeBySearchTermFromGoogle(searchTerm);           
            break;

        case EnumGeoSearchProvider.GEOCODIO:
            
            geoProviderSearchResult = await GetGeoCodeBySearchTermFromGeocodio(searchTerm);    
            break;    
            
        case EnumGeoSearchProvider.FREEGEOIP:
            
            geoProviderSearchResult = await GetGeoCodeBySearchTermFromFreegeoip(searchTerm);        
            break;               
    
        //... other providers can be implemented here

        default:
            break;
    }

    return geoProviderSearchResult;   
}



export const ConvertProviderDataToLocalFormat = async (searchTerm: string, 
                                                       geoProviderSearchResult:GeoProviderSearchResult,
                                                       enumProvider:EnumGeoSearchProvider,
                                                       serviceArea: string) => {

    
    let geoLocalSearchResult = new  GeoLocalSearchResult();

    switch (enumProvider) {

        case EnumGeoSearchProvider.GOOGLE:

            geoLocalSearchResult = await ConvertGoogleGeoDataToLocalFormat(searchTerm, geoProviderSearchResult);           
            break;

        case EnumGeoSearchProvider.GEOCODIO:
            
            geoLocalSearchResult = await ConvertGeocodioGeoDataToLocalFormat(searchTerm, geoProviderSearchResult);    
            break;    

        case EnumGeoSearchProvider.FREEGEOIP:
                                         
            geoLocalSearchResult = await ConvertFreeGeoipGeoDataToLocalFormat(searchTerm, geoProviderSearchResult);        
            break;               

        //... other providers can be implemented here

        default:
        break;
    }

    if (geoLocalSearchResult.location)
        geoLocalSearchResult.location.serviceArea = serviceArea;

    return geoLocalSearchResult;   

}




const GetGeoCodeBySearchTermFromGoogle = async (searchTerm:string) => {
    
    const options: NodeGeocoder.Options = {                            
        provider: 'google', 
        apiKey: googleApiKEY, 
        formatter: null
    };
    
    
    let geoProviderSearchResult = new  GeoProviderSearchResult();

    try {
 
        const nodeGeocoder = NodeGeocoder(options);
        const providerGeoData= await nodeGeocoder.geocode(searchTerm);
                    
        geoProviderSearchResult.providerGeoData = providerGeoData;

        
        if (providerGeoData && providerGeoData.length >0)
        {
            let tmpJsonGeoRes = JSON.parse((JSON.stringify(geoProviderSearchResult.providerGeoData[0])))
            geoProviderSearchResult.lat = tmpJsonGeoRes.hasOwnProperty('latitude') ? tmpJsonGeoRes.latitude as number : 0;
            geoProviderSearchResult.lng = tmpJsonGeoRes.hasOwnProperty('longitude') ? tmpJsonGeoRes.longitude as number : 0;
                
            geoProviderSearchResult.status = EnumGeoSearchStatus.OK;
            geoProviderSearchResult.search = searchTerm;
        }
        else
        {
            geoProviderSearchResult.status = EnumGeoSearchStatus.NOT_FOUND;
            geoProviderSearchResult.search = Messages.NON_EXISTING_ADDRESS_IN_PROVIDER;
        }



    } catch (error) {
        geoProviderSearchResult.status = EnumGeoSearchStatus.ERROR;
        geoProviderSearchResult.search = error;
    }

 
    return geoProviderSearchResult;
      
}



const GetGeoCodeBySearchTermFromGeocodio = async (searchTerm:string) => {
     
    let geoProviderSearchResult = new  GeoProviderSearchResult();

    //...

    geoProviderSearchResult.status = EnumGeoSearchStatus.NOT_FOUND;
    geoProviderSearchResult.search = Messages.NON_EXISTING_ADDRESS_IN_PROVIDER; 

    //...

    return geoProviderSearchResult;

}


const GetGeoCodeBySearchTermFromFreegeoip = async (searchTerm:string) => {

    let geoProviderSearchResult = new  GeoProviderSearchResult();

    //...

    geoProviderSearchResult.status = EnumGeoSearchStatus.NOT_FOUND;
    geoProviderSearchResult.search = Messages.NON_EXISTING_ADDRESS_IN_PROVIDER; 

    //...

    return geoProviderSearchResult;

}



const ConvertGoogleGeoDataToLocalFormat = async (searchTerm: string, geoProviderSearchResult:GeoProviderSearchResult) => {

    let geoLocalSearchResult = new  GeoLocalSearchResult();
    let tmpJsonGeoRes;

    try {

        tmpJsonGeoRes = JSON.parse((JSON.stringify(geoProviderSearchResult.providerGeoData[0])));
    

        geoLocalSearchResult.status = EnumGeoSearchStatus.OK;
        geoLocalSearchResult.search = searchTerm;
    
        geoLocalSearchResult.location =  new GeoLocalSearchLocation();
    
        geoLocalSearchResult.location.address1 = tmpJsonGeoRes.hasOwnProperty('streetNumber') ? tmpJsonGeoRes.streetNumber as string : '';
        geoLocalSearchResult.location.address2 = tmpJsonGeoRes.hasOwnProperty('streetName') ? tmpJsonGeoRes.streetName as string : '';;
              
        geoLocalSearchResult.location.city = tmpJsonGeoRes.hasOwnProperty('city') ? tmpJsonGeoRes.city as string : '';
        
        geoLocalSearchResult.location.lat = tmpJsonGeoRes.hasOwnProperty('latitude') ? tmpJsonGeoRes.latitude as number : 0;
        geoLocalSearchResult.location.lng = tmpJsonGeoRes.hasOwnProperty('longitude') ? tmpJsonGeoRes.longitude as number : 0;
    
        geoLocalSearchResult.location.postcode = tmpJsonGeoRes.hasOwnProperty('zipcode') ? tmpJsonGeoRes.zipcode as string : '';
        
        // if (tmpJsonGeoRes.hasOwnProperty('extra'))
        // {
        //     var tmpExtraJSON = JSON.parse((JSON.stringify(tmpJsonGeoRes.extra)));
    
        //     if (tmpExtraJSON.hasOwnProperty('neighborhood'))                        
        //         geoSearchResult.location.serviceArea = tmpExtraJSON.neighborhood;
    
        // }            
    } catch (error) {
        geoLocalSearchResult.status = EnumGeoSearchStatus.ERROR;
        geoLocalSearchResult.search = Messages.PROVIDER_TO_LOCALDATA_CONVERSION_ERROR_GOOGLE;
    }
   
    
    return geoLocalSearchResult;
}



const ConvertGeocodioGeoDataToLocalFormat = async (searchTerm: string, geoProviderSearchResult:GeoProviderSearchResult) => {

    let tmpJsonGeoRes = JSON.parse((JSON.stringify(geoProviderSearchResult.providerGeoData[0])))
    let geoLocalSearchResult = new  GeoLocalSearchResult();

    geoLocalSearchResult.status = EnumGeoSearchStatus.MUST_BE_IMPLEMENTED;
    geoLocalSearchResult.search = Messages.GEOCODIO_MUST_BE_IMPLEMENTED;

    //implementation for GEOCODIO can be done here
    //...

    return geoLocalSearchResult;
}


const ConvertFreeGeoipGeoDataToLocalFormat = async (searchTerm: string, geoProviderSearchResult:GeoProviderSearchResult) => {

    let tmpJsonGeoRes = JSON.parse((JSON.stringify(geoProviderSearchResult.providerGeoData[0])))
    let geoLocalSearchResult = new  GeoLocalSearchResult();

    geoLocalSearchResult.status = EnumGeoSearchStatus.MUST_BE_IMPLEMENTED;
    geoLocalSearchResult.search = Messages.FREEGEOIP_MUST_BE_IMPLEMENTED;

    //implementation for FREEGEOIP can be done here
    //...

    return geoLocalSearchResult;
}
