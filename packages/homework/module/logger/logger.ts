import { Inject } from '17zy_celestials_lib_di';
import { Observable, Subscription } from 'rxjs';

import { LoggerModule } from '.';
import { SRComponent } from '../../core/component';
import { Type } from '../../types';
import { ConsoleLogPrinter } from './console-log-printer';
import { LogPrinter } from './log-printer';
import { LogLevel, LogStreamData } from './types';


@SRComponent(LoggerModule)
export class Logger implements SRComponent<LoggerModule> {
    public readonly module!: LoggerModule;

    /**
     * log输入流
     */
    @Inject('input:log$')
    public readonly log$!: Observable<LogStreamData>;

    private subscription: Subscription | undefined;

    /**
     * 最大log级别，
     * 高于该级别的不处理
     * @type {LogLevel}
     */
    public maxLevel: LogLevel = LogLevel.Debug;

    /**
     * log输出器，
     * 默认为ConsoleLogPrinter
     * @type {Type<LogPrinter>}
     */
    public printerType: Type<LogPrinter> = ConsoleLogPrinter;


    constructor(params?: { printerType?: Type<LogPrinter> }) {
        if (params && params.printerType) {
            this.printerType = params.printerType;
        }
    }

    public onInitialized() {
        this.subscription = this.log$.subscribe(data => this.onLog(data));
    }

    public onLog(data: LogStreamData) {
        let level: number = data.level;

        // 默认等级
        if (!(level >= LogLevel.Emerg && level <= LogLevel.Debug)) {
            level = LogLevel.Debug;
        }

        // 限制等级
        if (level > this.maxLevel) { return; }

        // print
        const printer = this.module.getService(this.printerType);
        printer.printLog(data.channel || '', level, data.message);
    }

    public dispose() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
