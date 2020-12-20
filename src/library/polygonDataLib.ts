
import * as fs from 'fs';
import { EnumResult } from '../definitions/enums';
import { Result } from '../models/Result';
import * as Messages from '../definitions/messages';

/*
- This function is used to load polygon data from a given file into array 
  at init step of REST API.
- In a real app, this data could be fetched from a database such as mongo,etc
 */

export const ReadPolygonDataFromFileintoArray = async (fileName:string) => {
        
    let result = new Result();
    let fileContentAsArray = [];    
    let serviceArea = '';
    let coordArray = [];

    try {
                                    
        if (fs.existsSync(fileName))  {
            
            const fileContentAsString =  fs.readFileSync(fileName,'utf8');    
            const fileConentAsJson = JSON.parse(fileContentAsString);
                
            for (let i = 0; i < fileConentAsJson.features.length; i++) {        
                
                serviceArea = fileConentAsJson.features[i].properties.Name;
                coordArray = [];
    
                for (let j = 0; j < fileConentAsJson.features[i].geometry.coordinates[0].length; j++) {
    
                    let coordWith3Values = fileConentAsJson.features[i].geometry.coordinates[0][j];
                                    
                    //in example file lat,lng is not given, but lng,lat is given
                    let latitude =  coordWith3Values[1] as number; 
                    let longitude = coordWith3Values[0] as number;
    
                    coordArray.push( { latitude,  longitude} );
    
                }
    
                fileContentAsArray.push( {serviceArea, coordArray} );
            }

            if (fileContentAsArray.length == 0)
            {
                result.resultCode = EnumResult.ERROR;
                result.resultMessage = Messages.FILE_DOES_NOT_HAVE_DATA;
                result.object = [];
            }
            else
            {
                result.resultCode = EnumResult.OK;
                result.resultMessage = Messages.OK;
                result.object = fileContentAsArray;
            }

        }
        else
        {
            result.resultCode = EnumResult.ERROR;
            result.resultMessage = Messages.FILE_DOES_NOT_EXIST;
            result.object = [];
        }

    } catch (error) 
    {
        result.resultCode = EnumResult.ERROR;
        result.resultMessage = error as string;
        result.object = [];
        
    }
            
    return result;
}



export const ReadPolygonDataFromDatabase = async (DBconnStr:string) => {
       
    let fileContentAsArray: {serviceArea: string, coordArray: { latitude:number,  longitude:number}[] }[]= [];    
 
    //filling fileContentAsArray from database can be implemented here

    return fileContentAsArray;      
}
