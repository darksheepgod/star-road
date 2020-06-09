import { Inject } from '17zy_celestials_lib_di';
import { Observer } from 'rxjs';

import { SRService } from '../../core/service';
import { TickerStreamData } from '../../module/ticker/ticker-stream';
import { getNow } from '../../utils/date';
import { TickerModule } from './ticker-module';


declare global {
    interface Window {
        mozRequestAnimationFrame: typeof window.requestAnimationFrame;
        oRequestAnimationFrame: typeof window.requestAnimationFrame;
        msRequestAnimationFrame: typeof window.requestAnimationFrame;
    }
}
declare global {
    interface Window {
        mozCancelAnimationFrame: typeof window.cancelAnimationFrame;
        oCancelAnimationFrame: typeof window.cancelAnimationFrame;
        msCancelstAnimationFrame: typeof window.cancelAnimationFrame;
    }
}

// requestAnimationFrame方法，如果不存在就创建一个1/60秒的timeout
let requestAnimationFrame: (callback: (time: number) => void) => number;
{
    requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    if (!requestAnimationFrame) {
        requestAnimationFrame = callback => {
            return setTimeout(callback, 1000 / 60);
        };
    }
}

// cancelAnimationFrame方法，如果不存在就删除一个1/60秒的timeout
let cancelAnimationFrame: (handle: number) => void;
{
    cancelAnimationFrame =
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelstAnimationFrame;

    if (!cancelAnimationFrame) {
        cancelAnimationFrame = handle => {
            clearTimeout(handle);
        };
    }
}

/**
 * 使用页面frame触发的ticker
 * - 基于页面的requestAnimationFrame方法
 * - 如果页面没有该方法，则使用一个1/60秒的setTimeout。※ timeout对页面可见性的反应会与requestAnimationFrame不同 ※
 *
 * @author Helcarin
 * @export
 * @class FrameTicker
 */
@SRService(TickerModule)
export class FrameTicker implements SRService<TickerModule> {
    public readonly module!: TickerModule;

    @Inject('output:ticker$')
    private readonly ticker$!: Observer<TickerStreamData>;

    /** 内部timer id */
    private timerId: number = 0;

    /** 上次触发时间 */
    private lastTickTimeStamp: number = 0;


    constructor() {
        // 自动开始
        Promise.resolve().then(() => this.requestNext());
    }

    /**
     * 注册下一次触发
     * @protected
     */
    protected requestNext() {
        this.timerId = requestAnimationFrame(() => this.onTimer());
    }

    protected onTimer() {
        if (this.lastTickTimeStamp <= 0) {
            this.lastTickTimeStamp = getNow();
            this.requestNext();
            return;
        }

        const now = getNow();
        const delay = now - this.lastTickTimeStamp;
        this.lastTickTimeStamp = now;

        // dispatch
        this.ticker$.next({
            type: 'frame',
            now,
            delay,
        });

        // next
        this.requestNext();
    }

    public dispose() {
        if (this.timerId > 0) {
            cancelAnimationFrame(this.timerId);
        }
    }
}
