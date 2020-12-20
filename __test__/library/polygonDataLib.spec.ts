import * as polygonDataLib from '../../src/library/polygonDataLib';
import { Result } from '../../src/models/Result';

describe('polygon-data-tests', () => {

    describe('Check expected polygon array by file existence', () => {

        it('When file does not exist it should return empty array', async () => {

            //assign
            const fileName  = 'testFile.json'; //this file does not exist            
            

            //act
            const result:Result = await polygonDataLib.ReadPolygonDataFromFileintoArray(fileName);
            const expectedArray: {}[] = result.object;

            //assert
            expect(expectedArray.length).toBe(0);

        });

    });
    
});
 
 