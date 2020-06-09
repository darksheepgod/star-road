import { Subject } from 'rxjs';

import { Logger, LoggerModule, LogStreamData } from '../src/module/logger';


export function testLogger() {
    const log$ = new Subject<LogStreamData>();

    const lm = new LoggerModule();
    log$.subscribe(lm.inputLog$);
    const logger1 = lm.getComponent(Logger);

    setTimeout(() => {
        log$.next({
            channel: 'c1',
            level: 1,
            message: '111',
        });
    }, 500);
    setTimeout(() => {
        log$.next({
            channel: 'c2',
            level: 2,
            message: '222',
        });
    }, 800);
    setTimeout(() => {
        log$.next({
            channel: 'c3',
            level: 3,
            message: '333',
        });
    }, 2000);

}
