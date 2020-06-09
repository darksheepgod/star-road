import { OperationLoggerModule } from '.';
import { SRService } from '../../core/service';
import { formatDate } from '../../utils/date';
import { OperationLogPrinter } from './op-log-printer';
import { LogLevel, OperationLogInfo } from './types';


@SRService(OperationLoggerModule)
export class ConsoleOperationLogPrinter implements OperationLogPrinter {
    public readonly module!: OperationLoggerModule;

    public printLog(channel: string, level: LogLevel, info: OperationLogInfo): void {
        const dateStr = formatDate();
        const msg = `[${dateStr}][op:${info.op}] ${JSON.stringify(info)}`;

        if (typeof console !== 'undefined' && console.log) {
            if (level <= LogLevel.Err && console.error) {
                console.error(msg);
            } else {
                console.log(msg);
            }
        }
    }

    public dispose() {
    }
}
