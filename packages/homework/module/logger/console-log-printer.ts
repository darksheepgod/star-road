import { LoggerModule } from '.';
import { SRService } from '../../core/service';
import { formatDate } from '../../utils/date';
import { LogPrinter } from './log-printer';
import { LogLevel } from './types';


@SRService(LoggerModule)
export class ConsoleLogPrinter implements LogPrinter {
    public readonly module!: LoggerModule;

    public printLog(channel: string, level: LogLevel, msg: string): void {
        const dateStr = formatDate();
        msg = `[${dateStr}][${LogLevel[level]}][${channel}] ${msg}`;

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
