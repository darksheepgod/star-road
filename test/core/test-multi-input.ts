import { interval, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { DynamicInputsMergedStream } from '../src/utils/multi-input-stream';


export function testMultiInputs() {
    const m1 = new DynamicInputsMergedStream<string>();
    const ob1 = interval(100).pipe(
        take(100),
        map(x => String(100 + x)),
    );
    const s1 = new Subject<string>();
    ob1.subscribe(s1);
    const ob2 = interval(100).pipe(
        take(100),
        map(x => String(200 + x)),
    );
    const s2 = new Subject<string>();
    ob2.subscribe(s2);
    const ob3 = interval(100).pipe(
        take(100),
        map(x => String(300 + x)),
    );
    const s3 = new Subject<string>();
    ob3.subscribe(s3);

    m1.output$.subscribe(
        x => console.log(`on next: ${x}`),
        x => console.error(`on error: ${x}`),
        () => console.log('all complete'),
    );

    setTimeout(() => {
        m1.addInput(s1);
    }, 100);
    setTimeout(() => {
        m1.addInput(s2);
    }, 300);
    setTimeout(() => {
        m1.removeInput(s2);
    }, 500);
    setTimeout(() => {
        m1.addInput(s3);
    }, 700);
    setTimeout(() => {
        m1.dispose();
    }, 900);

}
