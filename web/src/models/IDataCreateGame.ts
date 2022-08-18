import { IUser } from './IUser';

export interface IDataCreateGame extends IUser {
  title: string,
  password: string,
  maxPlayers: number,
  countPlayers: number,

}
