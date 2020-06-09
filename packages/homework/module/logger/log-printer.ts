import { LoggerModule } from '.';
import { SRService } from '../../core/service';
import { LogLevel } from './types';


export interface LogPrinter extends SRService<LoggerModule> {
    printLog(channel: string, level: LogLevel, msg: string): void;
}
