// import { Observable, Subject } from 'rxjs';

// import { SRModule } from '../../core/module';
// import { Bus, Publisher, Stream } from '../../core/publisher';
// import { LifecycleStreamData } from '../lifecycle';
// import { LogStreamData } from '../logger';
// import { TickerStreamData } from '../ticker/ticker-stream';
// import { SoundLoadEvent, SoundPlayEvent } from './events';


// /**
//  * ### 基于WebAudioAPI的声音播放模块 ###
//  * - input
//  *    - ticker：时间
//  *    - lifecycle：页面生命周期
//  * - output
//  *    - log： log
//  *    - loadEvent： 全局加载事件
//  *    - playEvent： 全局播放事件
//  *
//  * @author Helcarin
//  * @export
//  * @class SoundModule
//  * @extends {SRModule}
//  */
// @Publisher()
// export class SoundModule extends SRModule {
//     /** 输入：时间流 */
//     @Stream('input:ticker$')
//     private readonly ticker$!: Subject<TickerStreamData>;

//     /** 输入：生命周期流 */
//     @Stream('input:lifecycle$')
//     private readonly lifecycle$!: Subject<LifecycleStreamData>;

//     /** 输出：log流 */
//     @Bus('bus:log$$')
//     public readonly log$!: Observable<LogStreamData>;

//     /** 输出：全局加载事件流 */
//     @Bus('bus:loadEvent$$')
//     public readonly loadEvent$!: Observable<SoundLoadEvent>;

//     /** 输出：全局播放事件流 */
//     @Bus('bus:playEvent$$')
//     public readonly playEvent$!: Observable<SoundPlayEvent>;

// }
