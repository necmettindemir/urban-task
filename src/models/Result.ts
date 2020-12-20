import { EnumResult } from "../definitions/enums";


export class Result {
    resultCode: EnumResult = EnumResult.UNDEFINED;
    resultMessage:string = '';
    object: any;
}