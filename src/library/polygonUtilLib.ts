import * as geolib from 'geolib';



export const isProvidersPointInLocalPolygonArray = async (
        latitude: number, 
        longitude: number, 
        localPolygonDataContentAsArray: any[])=> {

    /*
        localPolygonDataContentAsArray has many poligon each with its serviceArea name
    */

    let isPointinPolygon:boolean = false;
    let serviceArea = '';
                                                    
    for (let i = 0; i < localPolygonDataContentAsArray.length; i++) {

        var polygonCoordinatesArray = localPolygonDataContentAsArray[i].coordArray;
            
        isPointinPolygon = await isPointInPolygon(latitude,longitude,polygonCoordinatesArray);

        if (isPointinPolygon)
        {
                serviceArea = localPolygonDataContentAsArray[i].serviceArea;             
                break;
        }                    
    }  

    return {isPointinPolygon, serviceArea};   

}




export const isPointInPolygon = async (latitude: number, 
                                longitude: number, 
                                polyArray: {latitude:number, longitude:number}[]) => {


    const isPointinPoly =  geolib.isPointInPolygon( {latitude,longitude }, polyArray );
    

    return isPointinPoly;   
}
