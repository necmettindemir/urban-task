import { EnumGeoSearchProvider } from '../../src/definitions/enums';
import * as addressToCoordUtilLib from '../../src/library/addressToCoordUtilLib';
import { GeoProviderSearchResult } from '../../src/models/GeoProviderSearchResult';


describe('address-to-coordinat-util-tests', () => {

    describe('Check location by search term from GOOGLE', () => {

        it('When location exists it returns OK', async () => {

            //assign
            const searchTerm  = 'Hammersmith'; //this location exists            
            
            //act
            const geoProviderSearchResult: GeoProviderSearchResult = await addressToCoordUtilLib.GetGeoCodeBySearchTerm(searchTerm, EnumGeoSearchProvider.GOOGLE);

            //assert
            expect(geoProviderSearchResult.status).toEqual('OK');

        });


        it('When location DOES NOT exist it returns NOT_FOUND', async () => {

            //assign
            const searchTerm  = 'hshgfhgfhgfdghgd'; //this location does not exists            
            
            //act
            const geoProviderSearchResult: GeoProviderSearchResult = await addressToCoordUtilLib.GetGeoCodeBySearchTerm(searchTerm, EnumGeoSearchProvider.GOOGLE);

            //assert
            expect(geoProviderSearchResult.status).toEqual('NOT_FOUND');

        });


    });


    describe('Check location by search term from FREEGEOIP', () => {

        it('When location exists it returns OK', async () => {
                //can be implemented
        });


        it('When location DOES NOT exist it returns NOT_FOUND', async () => {
                //can be implemented
        });


    });
    

    
    describe('Check location by search term from GEOCODIO - MUST be implemented', () => {

        it('When location exists it returns OK', async () => {
                //can be implemented
        });


        it('When location DOES NOT exist it returns NOT_FOUND - MUST be implemented', async () => {
                //can be implemented
        });


    });
    
    
});
 
 