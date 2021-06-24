import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: User[], search: string): User[] {
    return value.filter((user: User) => user.username.toLowerCase().includes(search.toLowerCase()));
  }

}
