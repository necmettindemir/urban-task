/*
The aim of this file is to keep all ENUMs in the same place.
If the project is enterprise-level, ENUMs could be grouped in a seperate folder.
*/


/**********************EnumGeoSearchStatus**************************************/
/*
    At the moment, 
    the following status items can be used for status of request results
    Using this way will help developers NOT use static strings during development.
*/

export enum EnumGeoSearchStatus {
    OK                  = 'OK',
    NOT_FOUND           = 'NOT_FOUND',
    MUST_BE_IMPLEMENTED = 'MUST_BE_IMPLEMENTED',    
    INVALID_SEARCH_TERM = 'INVALID_SEARCH_TERM',
    ERROR               = 'ERROR',
    UNDEFINED           = 'UNDEFINED'
}

/**********************\EnumGeoSearchStatus**************************************/




/**********************EnumGeoSearchProvider**************************************/

/* Any of the following providers could be used for locations search*/

/*
'google' | 'geocodio' | 'freegeoip' | 'datasciencetoolkit' |
'locationiq' | 'mapquest' | 'openmapquest' |
'tomtom' | 'nominatimmapquest' |
'opencage' | 
'yandex' | 'teleport' | 'pickpoint' 
*/

export enum EnumGeoSearchProvider {
    GOOGLE              = 'google',
    GEOCODIO            = 'google',
    FREEGEOIP           = 'freegeoip',
    DATASCIENCETOOLKIT  = 'datasciencetoolkit',
    LOCATIONIQ          = 'locationiq',
    MAPQUEST            = 'mapquest',
    OPENMAPQUEST        = 'openmapquest',
    TOMTOM              = 'tomtom',
    NOMINATIMMAPQUEST   = 'nominatimmapquest',
    OPENCAGE            = 'opencage',
    YANDEX              = 'yandex',
    TELEPORT            = 'teleport',
    PICKPOINT           = 'pickpoint'
}


/**********************\EnumGeoSearchProvider**************************************/


/**********************EnumResult**************************************/
/*
    At the moment, 
    the following status items can be used for status of request results
    Using this way will help developers NOT use static strings during development.
*/

export enum EnumResult {
    OK                  = 'OK',  
    ERROR               = 'ERROR',
    UNDEFINED           = 'UNDEFINED'
}

/**********************\EnumGeoSearchStatus**************************************/

