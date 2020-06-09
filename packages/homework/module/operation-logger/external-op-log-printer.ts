import { log as externalLog } from '17zy_celestials_lib_external';

import { OperationLoggerModule } from '.';
import { SRService } from '../../core/service';
import { OperationLogPrinter } from './op-log-printer';
import { LogLevel, OperationLogInfo } from './types';


@SRService(OperationLoggerModule)
export class ExternalOperationLogPrinter implements OperationLogPrinter {
    public readonly module!: OperationLoggerModule;

    public printLog(channel: string, level: LogLevel, info: OperationLogInfo): void {
        externalLog.sendOpLog(info);
    }

    public dispose() {
    }
}
