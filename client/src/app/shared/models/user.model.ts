import { FileInput } from 'ngx-material-file-input';

export interface User {
  _id: string;
  prenom: string;
  nom: string;
  adresse: string;
  age: number;
  presentation: string;
  preferences: string[];
  avatar?: FileInput;
  email: string;
  password: string;
  username: string;
  friendList: string[];
  friendRequest: string[];
  waitConf: string[];
  genre: string;
  isAdmin: boolean;
  creatDate: Date;
  lastModif: Date;
  isConnect: boolean;
}
