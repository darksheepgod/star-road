// import { Inject } from '17zy_celestials_lib_di';
// import { Observable, Subject } from 'rxjs';

// import { SRComponent } from '../../core/component';
// import { getUuid } from '../../utils/uuid';
// import { SoundPlayEvent } from './events';
// import { SoundModule } from './sound-module';
// import { PlayState } from './types';
// import { WebAudioSound } from './web-audio-sound';


// /**
//  * WebAudio实现的音频播放器
//  *
//  * @author Helcarin
//  * @export
//  * @class WebAudioSoundPlayer
//  * @implements {SRComponent<SoundModule>}
//  */
// @SRComponent(SoundModule)
// export class WebAudioSoundPlayer implements SRComponent<SoundModule> {
//     public readonly module!: SoundModule;

//     /**
//      * uuid
//      * @type {string}
//      */
//     public readonly id: string = getUuid();

//     /**
//      * 声音资源
//      * @type {WebAudioSound}
//      */
//     public readonly sound: WebAudioSound;

//     /**
//      * 播放状态
//      * @type {PlayState}
//      */
//     protected _state: PlayState = PlayState.Initial;
//     public get state(): PlayState {
//         return this._state;
//     }

//     /**
//      * 当前播放进度（ms）
//      * @type {number}
//      */
//     protected _currentTime: number = 0;
//     public get currentTime(): number {
//         return this._currentTime;
//     }

//     protected readonly _playEvent$ = new Subject<SoundPlayEvent>();
//     /**
//      * 播放事件流
//      * @readonly
//      * @type {Observable<SoundPlayEvent>}
//      */
//     public get playEvent$(): Observable<SoundPlayEvent> {
//         return this._playEvent$;
//     }

//     /**
//      * 全局播放事件流
//      * @protected
//      */
//     @Inject('output:playEvent$$')
//     protected readonly globalPlayEvent$$!: Subject<Observable<SoundPlayEvent>>;

//     /** 音量（[0,1]） */
//     protected _volume: number = 1;
//     public get volume(): number {
//         return this._volume;
//     }
//     public set volume(value: number) {
//         this._volume = value;
//         // TODO
//     }


//     constructor(sound: WebAudioSound) {
//         this.sound = sound;
//     }

//     public onInitialized() {
//         // 将自身的播放事件流汇入全局
//         this.globalPlayEvent$$.next(this._playEvent$);

//         // TODO
//     }

//     protected dispatch(): void {
//         this._playEvent$.next({
//             player: this,
//             state: this.state,
//             currentTime: this.currentTime,
//         });
//     }

//     /**
//      * 播放
//      * @final
//      */
//     public play(): void {
//         if (this._state !== PlayState.Initial) { return; }

//         this._state = PlayState.Playing;
//         this.onPlay();
//         this.dispatch();
//     }

//     /**
//      * 播放的处理
//      * @protected
//      */
//     protected onPlay(): void {
//         // TODO
//     }

//     /**
//      * 暂停
//      * @final
//      */
//     public pause(): void {
//         if (this._state !== PlayState.Playing) { return; }

//         this._state = PlayState.Paused;
//         this.onPause();
//         this.dispatch();
//     }

//     /**
//      * 暂停的处理
//      * @abstract
//      * @protected
//      */
//     protected onPause(): void {
//         // TODO
//     }

//     /**
//      * 恢复
//      * @final
//      */
//     public resume(): void {
//         if (this._state !== PlayState.Paused) { return; }

//         this._state = PlayState.Playing;
//         this.onResume();
//         this.dispatch();
//     }

//     /**
//      * 恢复的处理
//      * @abstract
//      * @protected
//      */
//     protected onResume(): void {
//         // TODO
//     }

//     /**
//      * 跳转
//      * @final
//      */
//     public seekTo(time: number): void {
//         this.onSeekTo(time);
//         this.dispatch();
//     }

//     /**
//      * 跳转的处理
//      * @abstract
//      * @protected
//      */
//     protected onSeekTo(time: number): void {
//         // TODO
//     }

//     /**
//      * 停止
//      * @final
//      */
//     public stop(): void {
//         this._state = PlayState.Aborted;
//         this.onStop();
//         this.dispatch();
//     }

//     /**
//      * 停止的处理
//      * @abstract
//      * @protected
//      */
//     protected onStop(): void {
//         // TODO
//     }

//     public dispose(): void {
//         this._playEvent$.unsubscribe();
//     }

//     public toString(): string {
//         return `[${this.constructor.name}]<${this.id}>`;
//     }
// }
