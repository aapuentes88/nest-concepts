import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {

 constructor(private usersService: UsersService){

 }

 async singup(email: string, password: string){

  //See if email is in use
  const users = await this.usersService.find(email)
  if(users.length){
    throw new BadRequestException("Email in use");    
  }

  //hash de user password
  //generate a salt
  const salt = randomBytes(8).toString('hex')

  //hash the salt and the password together
  const hash = (await scrypt(password, salt, 32)) as Buffer

  //Join de hashed result and the salt together
  const result = salt + '.' + hash.toString('hex')

  //Create new user and save it
  const user = await this.usersService.create(email, result)

  return user

 }

 async singin(email: string, password: string){

  //See if email is on the db
  const [user] = await this.usersService.find(email)
  if(!user){
    throw new NotFoundException("Email is not singup");    
  }

  //Get user hashed password and salt
  const [salt, hashedPass] = user.password.split('.')

  //Hash de password incoming
  const incomingPassHash = (await scrypt(password,salt,32)) as Buffer

  //Compare two hashed pass
  if(hashedPass !== incomingPassHash.toString('hex')){
    throw new BadRequestException("Password is not correct"); 
  }

  return user
 }

}