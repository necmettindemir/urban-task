import * as polygonUtilLib from '../../src/library/polygonUtilLib';


describe('polygon-util-tests', () => {

    describe('Check lat,lng in polygon given with polygon points', () => {

        it('When lat,lng is in polygon it should return true', async () => {

            //assign
            const latitude  = 51.5125;
            const longitude = 7.485;

            const polyArray:{latitude: number, longitude: number}[] = [
                { latitude: 51.5, longitude: 7.4 },
                { latitude: 51.555, longitude: 7.4 },
                { latitude: 51.555, longitude: 7.625 },
                { latitude: 51.5125, longitude: 7.625 },
            ];


            //act
            const isPointinPoly = await polygonUtilLib.isPointInPolygon(latitude,longitude,polyArray);

            //assert
            expect(isPointinPoly).toBeTruthy();

        });



        it('When lat,lng is in NOT polygon it should return false', async () => {

            //assign
            const latitude  = 52.5125;
            const longitude = 7.485;

            const polyArray:{latitude: number, longitude: number}[] = [
                { latitude: 51.5, longitude: 7.4 },
                { latitude: 51.555, longitude: 7.4 },
                { latitude: 51.555, longitude: 7.625 },
                { latitude: 51.5125, longitude: 7.625 },
            ];


            //act
            const isPointinPoly = await polygonUtilLib.isPointInPolygon(latitude,longitude,polyArray);

            //assert
            expect(isPointinPoly).toBeFalsy();

        });



        it('When polygon array is empty it should return false', async () => {

            //assign
            const latitude  = 52.5125;
            const longitude = 7.485;

            const polyArray:{latitude: number, longitude: number}[] = [];


            //act
            const isPointinPoly = await polygonUtilLib.isPointInPolygon(latitude,longitude,polyArray);

            //assert
            expect(isPointinPoly).toBeFalsy();

        });


    });
    
});
 
 