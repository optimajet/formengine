import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dump',
  standalone: true
})
export class DumpPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let data = JSON.stringify(value, null, '\t');
    console.log(data);
    // debugger
    return data;
  }
}
