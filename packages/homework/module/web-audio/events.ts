// import { Sound } from './sound';
// import { SoundPlayer } from './sound-player';
// import { LoadState, PlayState } from './types';


// /**
//  * 加载流程事件
//  * （“初始”、“错误”、“完成”状态下不会触发）
//  */
// export interface SoundLoadEvent {
//     /**
//      * 音频
//      * @type {Sound}
//      */
//     sound: Sound;

//     /**
//      * 状态
//      * @type {LoadState}
//      */
//     state: LoadState;

//     /**
//      * 总时长（ms）
//      * 有可能为0，表示尚未获取到，或者不支持获取
//      * @type {number}
//      */
//     duration?: number;

//     /**
//      * 当前加载时长（ms）
//      * 只有能获取到总时长的时候才会传
//      * @type {number}
//      */
//     loaded?: number;

//     /**
//      * 进度(0-1)
//      * 当获取不到总时长的时候，加载事件只传进度
//      * @type {number}
//      */
//     progress?: number;

//     /**
//      * 错误
//      * @type {{ code: number, message: string }}
//      */
//     error?: { code: number, message: string };
// }

// /**
//  * 播放流程事件
//  * （初始、错误、中止、结束状态不会触发）
//  */
// export interface SoundPlayEvent {
//     /**
//      * 播放器
//      * @type {SoundPlayer}
//      */
//     player: SoundPlayer;

//     /**
//      * 状态
//      * @type {PlayState}
//      */
//     state: PlayState;

//     /**
//      * 当前播放位置（ms）
//      * @type {number}
//      */
//     currentTime?: number;

//     /**
//      * 错误
//      * @type {{ code: number, message: string }}
//      */
//     error?: { code: number, message: string };
// }
