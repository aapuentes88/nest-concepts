import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";
import { Observable} from "rxjs";
import {  map } from "rxjs/operators";
import { UserDto } from "src/users/dto/user.dto";

//Validate at least de decorator recive a class
interface ClassConstructor {
    new (...args: any[])
}

//Refactor decorator use with a shorter line of code @Serialize()
export function Serialize(dto: ClassConstructor){
    return UseInterceptors((new SerializeInterceptor(dto)))
}

export class SerializeInterceptor /*implements NestInterceptor -se puede ya que TS es tipado estructural*/{

    constructor(private customDto: any){
    }

    intercept(context: ExecutionContext, nextHandler: CallHandler  ): Observable<any>{
         //Running before the request is handle by the request handler 
         console.log('Im running before de handler', context)

         return nextHandler.handle().pipe(
            map((data: any) => {
                //Running before the response is sent out
                console.log('Im running before de send out', data)
                return plainToInstance(this.customDto, data, {
                    excludeExtraneousValues: true
                })
            })
         )
    }
}