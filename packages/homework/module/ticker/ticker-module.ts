import { Subject } from 'rxjs';

import { SRModule } from '../../core/module';
import { Publisher, Stream } from '../../core/publisher';
import { TickerStreamData } from './ticker-stream';

// TODO 页面生命周期规则

@Publisher()
export class TickerModule extends SRModule {
    @Stream('output:ticker$')
    public readonly ticker$!: Subject<TickerStreamData>;

    // /**
    //  * 页面隐藏时的挂起。
    //  * active类型的ticker会暂停。
    //  * TODO 页面生命周期相关规则
    //  *
    //  * @author Helcarin
    //  */
    // public suspend() {
    //     if (this.state !== 'running') { return; }
    //     this.state = 'suspended';
    //     // TODO
    // }

    // /**
    //  * 从挂起中恢复。
    //  * active类型的ticker会从暂停中恢复。
    //  *
    //  * @author Helcarin
    //  */
    // public resume() {
    //     if (this.state !== 'suspended') { return; }
    //     this.state = 'running';
    //     // TODO
    // }

    // public dispose() {
    //     if (this.state === 'closed') { return; }
    //     this.state = 'closed';

    //     if (this._frameTicker) {
    //         this._frameTicker.dispose();
    //     }
    // }
}
