import { OperationLoggerModule } from '.';
import { SRService } from '../../core/service';
import { LogLevel, OperationLogInfo } from './types';


export interface OperationLogPrinter extends SRService<OperationLoggerModule> {
    printLog(channel: string, level: LogLevel, info: OperationLogInfo): void;
}
