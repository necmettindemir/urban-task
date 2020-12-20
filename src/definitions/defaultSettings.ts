
import * as ENUM from './enums';

/*
The aim of this file is to keep all settigns in same place.
If the project is enterprise level constants could be grouped in a seperate folder.
*/

export let googleApiKEY:string = 'AIzaSyAdU7NU2sGkT4uPgscpgYweDb3g05wfHYA';
export let geocodioApiKEY:string  = '***';  //for future
export let freegeoipAPiKEY:string  = '***'; //for future


export let defaultProvider = ENUM.EnumGeoSearchProvider.GOOGLE;

export let validateTerm:boolean = true;
export let writeLogsToConsole:boolean = true;

export let defaultPolygonDataFile = 'formatted-districts.json';  

