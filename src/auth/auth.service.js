import { Injectable, Dependencies } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Dependencies(UsersService, JwtService)
@Injectable()
export class AuthService {
  constructor(usersService, jwtService){
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  async validateUser(username, pass) {
    const user = await this.usersService.findOne(username);
    //console.log(bcrypt.hashSync(pass, 10));
    //console.log(user);
    if (user && bcrypt.compareSync(pass, user.hash)) {
      const { hash, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user) {
    const payload = { username: user.login, sub: user.idUser };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}