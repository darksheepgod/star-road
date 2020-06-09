// import { Inject } from '17zy_celestials_lib_di';
// import { Observable, Subject } from 'rxjs';

// import { SRComponent } from '../../core/component';
// import { getUuid } from '../../utils/uuid';
// import { TickerStreamData } from '../ticker/ticker-stream';
// import { SoundLoadEvent } from './events';
// import { SoundModule } from './sound-module';
// import { LoadState } from './types';
// import { WebAudioSoundManager } from './web-audio-sound-manager';
// import { WebAudioSoundPlayer } from './web-audio-sound-player';


// /**
//  * WebAudio API 实现的音频
//  *
//  * @author Helcarin
//  * @export
//  * @class WebAudioSound
//  * @implements {SRComponent<SoundModule>}
//  */
// @SRComponent(SoundModule)
// export class WebAudioSound implements SRComponent<SoundModule> {
//     /**
//      * 自动加载并播放一个音频，
//      * 当播放完成或中止时，自动销毁该Sound对象。
//      * @returns {WebAudioSoundPlayer}
//      */
//     public static loadAndPlay(url: string): Promise<void> {
//         // TODO
//         return Promise.reject('TODO');

//         // const sound = this.module.instantiate(WebAudioSound, url);
//         // const subscription = sound.loadEvents$.subscribe(event => {
//         //     if (event.state === LoadState.Loaded) {
//         //         subscription.unsubscribe();
//         //         const player = sound.play();
//         //         const subscription2 = player.playEvent$.subscribe(event => {
//         //             if (event.state === PlayState.Error) {}
//         //         });
//         //         player.play();
//         //     }
//         // });
//         // sound.load();
//     }

//     public readonly module!: SoundModule;

//     public readonly id: string = getUuid();

//     public readonly url: string;

//     protected _state: LoadState = LoadState.Initial;
//     public get state(): LoadState {
//         return this._state;
//     }

//     /**
//      * 时长（ms）
//      * @readonly
//      * @type {number}
//      */
//     public get duration(): number {
//         if (this._audioBuffer) {
//             return this._audioBuffer.duration * 1000;
//         } else {
//             return 0;
//         }
//     }

//     /** sound管理器 */
//     @Inject(WebAudioSoundManager)
//     protected readonly soundManager!: WebAudioSoundManager;

//     /** 输入时间流 */
//     @Inject('input:ticker')
//     protected readonly ticker$!: Observable<TickerStreamData>;

//     /** 全局加载事件流流 */
//     @Inject('bus:loadEvent')
//     public readonly globalLoadEvent$$!: Subject<Observable<SoundLoadEvent>>;

//     protected readonly _loadEvent$ = new Subject<SoundLoadEvent>();
//     /** 加载事件流 */
//     public get loadEvent$(): Observable<SoundLoadEvent> {
//         return this._loadEvent$;
//     }

//     protected readonly _players: Set<WebAudioSoundPlayer> = new Set();
//     /** 播放器 */
//     public get players(): Set<WebAudioSoundPlayer> {
//         return this._players;
//     }

//     private _audioBuffer: AudioBuffer | undefined;
//     /** AudioBuffer */
//     public get audioBuffer(): AudioBuffer | undefined {
//         return this._audioBuffer;
//     }


//     constructor(url: string) {
//         this.url = url;
//     }

//     public onInitialized() {
//         this.globalLoadEvent$$.next(this._loadEvent$);
//     }

//     /**
//      * 加载
//      */
//     public load(): void {
//         if (this._state !== LoadState.Initial) { return; }

//         this._state = LoadState.Loading;
//         this._loadEvent$.next({
//             sound: this,
//             state: this._state,
//             duration: 0,
//             loaded: 0,
//         });

//         this.loadAndDecode();
//     }

//     /**
//      * 加载&解码
//      */
//     protected loadAndDecode() {
//         const xhr = new XMLHttpRequest();

//         xhr.open('GET', this.url);
//         xhr.responseType = 'arraybuffer';

//         xhr.onload = (evt: Event) => {
//             // AudioContext.prototype.decodeAudioData() 旧版不兼容promise，需要传入回调
//             this.soundManager.audioContext.decodeAudioData(
//                 xhr.response,
//                 (audioBuffer: AudioBuffer) => {
//                     this._audioBuffer = audioBuffer;
//                     this.onLoadComplete();
//                 },
//                 error => {
//                     // 解码失败被定义为加载失败
//                     this._state = LoadState.Error;
//                     this._loadEvent$.next({
//                         sound: this,
//                         state: this._state,
//                         error: { code: 58996, message: `解码失败 (${error}` },
//                     });
//                 },
//             );
//         };

//         xhr.onprogress = (evt: ProgressEvent) => {
//             // 等知道长度了再派发progress
//             if (!evt.lengthComputable) { return; }
//             this._loadEvent$.next({
//                 sound: this,
//                 state: LoadState.Loading,
//                 duration: evt.total,
//                 loaded: evt.loaded,
//             });
//         };

//         xhr.onerror = (evt: ErrorEvent) => {
//             this._state = LoadState.Error;
//             this._loadEvent$.next({
//                 sound: this,
//                 state: this._state,
//                 error: { code: 58996, message: `加载失败 (${evt.error})` },
//             });
//         };

//         xhr.send();
//     }

//     /** 加载完成 */
//     protected onLoadComplete() {
//         this._state = LoadState.Loaded;

//         this._loadEvent$.next({
//             sound: this,
//             state: this._state,
//             duration: this.duration,
//         });
//     }

//     /**
//      * 播放
//      * @returns {WebAudioSoundPlayer}
//      */
//     public play(): WebAudioSoundPlayer | null {
//         const player = this.module.getComponent(WebAudioSoundPlayer, this);
//         this.players.add(player);

//         return player;
//     }

//     /**
//      * 销毁
//      */
//     public dispose(): void {
//         this.players.forEach(player => player.dispose());
//         this.players.clear();
//     }
// }
