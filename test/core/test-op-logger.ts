import { Subject } from 'rxjs';

import {
    ConsoleOperationLogPrinter,
    OperationLogger,
    OperationLoggerModule,
    OperationLogStreamData,
} from '../src/module/operation-logger';


export function testOpLogger() {
    const opLog$ = new Subject<OperationLogStreamData>();

    const lm = new OperationLoggerModule();
    opLog$.subscribe(lm.inputLog$);
    const opLogger1 = lm.getComponent(OperationLogger, { printerType: ConsoleOperationLogPrinter });
    opLogger1.maxLevel = 6;
    // opLogger1.printerType = ConsoleOperationLogPrinter;

    setTimeout(() => {
        opLog$.next({
            channel: 'rc1',
            info: {
                op: 'op1',
                level: 1,
                msg: '111',
            },
        });
    }, 200);
    setTimeout(() => {
        opLog$.next({
            channel: 'rc2',
            info: {
                op: 'op2',
                level: 3,
                msg: '222',
            },
        });
    }, 400);
    setTimeout(() => {
        opLog$.next({
            channel: 'rc3',
            info: {
                op: 'op3',
                level: 5,
                msg: '333',
            },
        });
    }, 600);
    setTimeout(() => {
        opLog$.next({
            channel: 'rc3',
            info: {
                op: 'op3',
                level: 7,
                msg: '333',
            },
        });
    }, 600);

}
