import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';
@Controller('auth')
@Serialize(UserDto)
//@UseInterceptors(CurrentUserInterceptor) //Put interceptor globally to reduce code in all controlers
export class UsersController {

  constructor(private usersService: UsersService, private authService: AuthService){

  }
  //Cookie-Session samples
  // @Get('/color/:color')
  // setColor(@Param('color') color: string, @Session() session: any) {
  //     session.color = color
  // }

  // @Get('/colors')
  // getColor( @Session() session: any) {
  //     return session.color
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoami( @Session() session: any) {
      return this.usersService.findOne(session.userId)
  }

  @Get('/whoamidecorator')
  @UseGuards(AuthGuard)
  whoamidecorator( @CurrentUser() user: User) {
      console.log(user)
      return user
  }

  @Get('/singout')
  singout( @Session() session: any) {
      session.userId = null
  }

  @Post('/singup')
  async createUSer(@Body() body: CreateUserDto, @Session() session: any) {
      // this.usersService.create(body.email, body.password)
      const user = await this.authService.singup(body.email, body.password)
      session.userId = user.id
      return user
  }

  @Post('/singin')
  async singin(@Body() body: CreateUserDto, @Session() session: any) {
      // this.usersService.create(body.email, body.password)
      const user = await this.authService.singin(body.email, body.password)
      session.userId = user.id
      return user
  }

  @Get('/:id')
  // @UseInterceptors(ClassSerializerInterceptor) //Entity Exclude comment
  // @UseInterceptors(SerializeInterceptor) //Hard-Code SerializeInterceptor with specific Dto(UserDto)
  // @UseInterceptors(new SerializeInterceptor(UserDto))//Make shorter this line with refactor decorator
  // @Serialize(UserDto)// Use decorator to the class to alter all the routes
  async findUSer(@Param('id') id: string) {
    console.log('Handler is running')
    const user = await this.usersService.findOne(parseInt(id))
    if(!user){
      throw new NotFoundException("User not found");
      
    }
      return user
  }

  @Get()
  findAllUSer(@Query('email') email: string) {
      return this.usersService.find(email)
  }

  @Delete('/:id')
  deleteUSer(@Param('id') id: string) {
      return this.usersService.remove(parseInt(id))
  }

  @Patch('/:id')
  updateUSer(@Param('id') id: string, @Body() body: UpdateUserDto) {
      return this.usersService.update(parseInt(id), body)
  }
}
 