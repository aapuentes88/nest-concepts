import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { Observable} from "rxjs";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

    constructor(private usersService: UsersService){
    }

    intercept(context: ExecutionContext, nextHandler: CallHandler  ): Observable<any>{
      console.log('Init intercept')
      const request = context.switchToHttp().getRequest()
      const {userId} = request.session
      if(userId) {
        const user = this.usersService.findOne(userId)
        request.currentUser= user
      }
      console.log('End intercept')
      return nextHandler.handle()
    }
}