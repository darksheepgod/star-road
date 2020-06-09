import { Inject } from '17zy_celestials_lib_di';
import { Observable, Subscription } from 'rxjs';

import { OperationLoggerModule } from '.';
import { SRComponent } from '../../core/component';
import { Type } from '../../types';
import { ExternalOperationLogPrinter } from './external-op-log-printer';
import { OperationLogPrinter } from './op-log-printer';
import { LogLevel, OperationLogStreamData } from './types';


@SRComponent(OperationLoggerModule)
export class OperationLogger implements SRComponent<OperationLoggerModule> {
    public readonly module!: OperationLoggerModule;

    /**
     * oplog输入流
     */
    @Inject('input:log$')
    public readonly log$!: Observable<OperationLogStreamData>;

    private subscription: Subscription | undefined;

    /**
     * 最大log级别，
     * 高于该级别的不处理
     * @type {LogLevel}
     */
    public maxLevel: LogLevel = LogLevel.Debug;

    /**
     * log输出器class，
     * 默认为ExternalOperationLogHandler
     * @type {Type<OperationLogPrinter>}
     */
    public printerType: Type<OperationLogPrinter> = ExternalOperationLogPrinter;

    constructor(params?: { printerType?: Type<OperationLogPrinter> }) {
        if (params && params.printerType) {
            this.printerType = params.printerType;
        }
    }

    public onInitialized() {
        this.subscription = this.log$.subscribe(data => this.onLog(data));
    }

    public onLog(data: OperationLogStreamData) {
        let level: number = data.info.level;

        // 默认等级
        if (!(level >= LogLevel.Emerg && level <= LogLevel.Debug)) {
            level = LogLevel.Debug;
        }

        // 限制等级
        if (level > this.maxLevel) { return; }
        data.info.level = level;

        // 转化为log接口需要的数据
        const pkg: any = data.info;
        pkg._lv = level;
        delete pkg.level;
        if (pkg.errCode) {
            pkg.err_code = pkg.errCode;
            delete pkg.errCode;
        }

        // print
        const printer = this.module.getService(this.printerType);
        printer.printLog(data.channel || '', level, data.info);
    }

    public dispose() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
