import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
  console.log('Init decorator')
  const request = context.switchToHttp().getRequest()
  console.log('End decorator')
  return request.currentUser
})