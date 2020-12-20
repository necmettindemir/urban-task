
import express from 'express';

import * as addressToCoordUtilLib from './library/addressToCoordUtilLib';
import * as polygonDataLib  from './library/polygonDataLib';
import * as polygonUtilLib from './library/polygonUtilLib';
import * as validationUtilLib from './library/validationUtilLib';

import { GeoLocalSearchResult } from './models/GeoLocalSearchResult';
import { GeoProviderSearchResult } from './models/GeoProviderSearchResult';

import * as ENUMS  from './definitions/enums';
import * as Messages from './definitions/messages';
import * as DefaultSettings from './definitions/defaultSettings';
import { Result } from './models/Result';


//-------------------
const port = 4001;
const app = express();
//-------------------

/*
    2 steps will be implemented
    
    Step 1: Initialization and starting service
    
            1.1. Do all possible initialization operations for solution 

            e.g. 
            
            - Loading LOCAL polygon data into array grouping by service area at startup
              This step can be done once before service start
            - For this task, this data is fetched from a given file, 
              however it could be a database

            e.g.

            Content of <root/>/src/definitions/defaultSettings.ts 
            could be setup at this step
            
            1.2. Start listening for requests
            
    Step 2: Searching term/location by GET method in API
    
            2.1. "SearchTerm" Validation could be done, 
            so that meaningless/gibberish data is not processed
            
            For such a task some npm libraries could be used.
            e.g. gibberish-detector, asdfjkl, etc.


            2.2. Searching term in provider such as google, etc.    
            At the end of this step a {lat,lng} should be received

            2.3. Searching provider's {lat,lng} in local polygon mem-array

            2.4. If provider's {lat,lng} is found in local polygon mem-array
            then combine data that is received from provider and 
            serviceArea name from local polygon mem-array.

            Return this combined data.

            This data should be returned from GET method.
            Method: GET /servicearea/:searchterm


            Note: 
            
            When an error or improper case occured, returned data should include 
            related and meaningful messages within "status" and "search" parts of 
            JSON result.

*/



/* 
    This array will be filled on REST API service start 
    so that 
    at each search request we do not need to get all polygon data from data source
*/
let localPolygonDataContentAsArray: any[] = []; 



app.get('/servicearea/:searchterm', async (req,res) => {
        
    const searchTerm =  req.params.searchterm; 
    let provider = DefaultSettings.defaultProvider; /* ENUMS.EnumGeoSearchProvider.GOOGLE */
    
    let geoProviderSearchResult = new GeoProviderSearchResult(ENUMS.EnumGeoSearchStatus.OK);
    let geoLocalSearchResult = new GeoLocalSearchResult();
    
    if (DefaultSettings.writeLogsToConsole)
        console.log(`\nsearchTerm : ${searchTerm}`);
    

 

    //---- Step 2.1 -- searchTerm validation ---
        
    let isValidSearchTerm = true;
    
    if (DefaultSettings.validateTerm)
        isValidSearchTerm = await validationUtilLib.isValidSearchTerm(searchTerm);
    
    //---- /Step 2.1 -- searchterm validation ---


    
    //---- Step 2.2 -- GetGeoCodeBySearchTerm from available providers  ---

    if (isValidSearchTerm)
    {    
        try {
            geoProviderSearchResult = await addressToCoordUtilLib.GetGeoCodeBySearchTerm(searchTerm, provider);               
        } catch (err) {        
            geoProviderSearchResult.status = ENUMS.EnumGeoSearchStatus.ERROR;
            geoProviderSearchResult.search = err as string;
        }
        

        if (geoProviderSearchResult.status !== ENUMS.EnumGeoSearchStatus.OK)        
        {
            /* FOR FUTURE - alternative providers can be evaluated at this point */

            //... geocodio implementation can be done here

            provider = ENUMS.EnumGeoSearchProvider.GEOCODIO;

            try {
                geoProviderSearchResult = await addressToCoordUtilLib.GetGeoCodeBySearchTerm(searchTerm, provider);               
            } catch (err) {        
                geoProviderSearchResult.status = ENUMS.EnumGeoSearchStatus.ERROR;
                geoProviderSearchResult.search = err as string;
            }

        }                
        

        if (geoProviderSearchResult.status !== ENUMS.EnumGeoSearchStatus.OK)        
        {
            /* FOR FUTURE - alternative providers can be evaluated at this point */

            //... freegeoip implementation can be done here
            provider = ENUMS.EnumGeoSearchProvider.FREEGEOIP;

            try {
                geoProviderSearchResult = await addressToCoordUtilLib.GetGeoCodeBySearchTerm(searchTerm, provider);               
            } catch (err) {        
                geoProviderSearchResult.status = ENUMS.EnumGeoSearchStatus.ERROR;
                geoProviderSearchResult.search = err as string;
            }

        }     

        
        //... other providers can be implemented here

    }

    
    if (geoProviderSearchResult.status === ENUMS.EnumGeoSearchStatus.OK)
    {      
        if (DefaultSettings.writeLogsToConsole)
        {
            let tmpProviderGeoData = geoProviderSearchResult.providerGeoData;    
            console.log('\nProviderGeoData: ', JSON.parse(JSON.stringify(tmpProviderGeoData)) );    
        }          
    }    
   

    //---- /Step 2.2 -- GetGeoCodeBySearchTerm from available providers  ---


    //----- Step 2.3 ---- Search provider's {lat,lng} in local poligons array -----

    let isProvidersPointinLocalPolygon: boolean = false; 
    let serviceArea: string = '';

    if (geoProviderSearchResult.status === ENUMS.EnumGeoSearchStatus.OK)
    {                
        try {
            
            const lat:number = geoProviderSearchResult.lat;
            const lng:number = geoProviderSearchResult.lng;
                        
            let isPointInLocalPolygonArray :{isPointinPolygon:boolean,serviceArea:string};
            isPointInLocalPolygonArray = await polygonUtilLib.isProvidersPointInLocalPolygonArray( 
                                            lat, 
                                            lng, 
                                            localPolygonDataContentAsArray
                                        );

            isProvidersPointinLocalPolygon = isPointInLocalPolygonArray.isPointinPolygon;
            serviceArea = isPointInLocalPolygonArray.serviceArea;
                    
                    
        } catch (err) {
            geoLocalSearchResult.status = ENUMS.EnumGeoSearchStatus.ERROR;
            geoLocalSearchResult.search = err as string;            
        } 
                        
    }
    else
    {
            
        geoLocalSearchResult = new GeoLocalSearchResult();
        geoLocalSearchResult.status = geoProviderSearchResult.status;
        geoLocalSearchResult.search = geoProviderSearchResult.search;
    }
    //----- /Step 2.3 ---- Search provider's {lat,lng} in local poligons array -----



    //-----Step 2.4 ---- Convert provider data to target local data format  -----    
    if (geoProviderSearchResult.status === ENUMS.EnumGeoSearchStatus.OK)
    {

        if ((isProvidersPointinLocalPolygon))
            {
                
                try {
                        geoLocalSearchResult = await addressToCoordUtilLib.ConvertProviderDataToLocalFormat(
                                                                        searchTerm, 
                                                                        geoProviderSearchResult,
                                                                        provider, 
                                                                        serviceArea);               


                } catch (err) {        
                        geoLocalSearchResult.status = ENUMS.EnumGeoSearchStatus.ERROR;
                        geoLocalSearchResult.search = err as string;
                }
                
            }
            else{        
                geoLocalSearchResult = new GeoLocalSearchResult();
                geoLocalSearchResult.status = ENUMS.EnumGeoSearchStatus.NOT_FOUND;
                geoLocalSearchResult.search = Messages.NON_EXISTING_ADDRESS_IN_SERVICE_AREA;
            }

    }
    
 
    //-----/Step 2.4 ---- Convert provider data to target local data format  -----
    

    const geoLocalSearchResultAsJSON =JSON.parse(JSON.stringify(geoLocalSearchResult));
    
    if (DefaultSettings.writeLogsToConsole)
        console.log('\ngeoLocalSearchResultAsJSON: ', geoLocalSearchResultAsJSON);
    
    res.status(200).send(geoLocalSearchResultAsJSON); /* returns result as expected format */

});



(async () => {
                          
    //--- Step 1.1 --- Do all possible initialization operations for solution  --
        
    // e.g. Polygon data is fetched from data source as done
    // e.g. Solution based default parameters could be fetched from database
    // e.g. etc.

    let fileReadResult =  new  Result();

    try {  
       
        const fileName = __dirname + "/" + DefaultSettings.defaultPolygonDataFile;
        
        fileReadResult = await polygonDataLib.ReadPolygonDataFromFileintoArray(fileName);

        if (fileReadResult.resultCode == ENUMS.EnumResult.OK)
        {
            localPolygonDataContentAsArray = fileReadResult.object;            
            
            console.log('Number of service area: ', localPolygonDataContentAsArray.length);

            if (localPolygonDataContentAsArray.length >0 )            
                console.log('Local polygon data for service areas are loaded into mem-array');                                
            else                
                console.log('Local polygon data for service areas are NOT loaded into mem-array - Zero Lengtth array');
            
        }
        else {            
            console.log('ResultCode :', fileReadResult.resultCode);
            console.log('ResultMessage :', fileReadResult.resultMessage);
        }
 
        
    } catch (err) {            
        console.log(err);
    }
    
    //--- /Step 1.1 --- Do all possible initialization operations for solution  --



    //--- Step 1.2 --- start service listening --

    if (localPolygonDataContentAsArray.length >0 )  
    {
        try {
                app.listen(port, async () => {        
                    console.log(`Listening on port ${port} - ${ new Date() }`);            
                });
    
        } catch (error) {
            console.log(error as string);
        }
    }
    else
    {
        console.log("Service NOT started");            
    }

    //--- /Step 1.2 --- start service listening --
     
})();
