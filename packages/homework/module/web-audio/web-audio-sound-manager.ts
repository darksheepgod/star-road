// import { Inject } from '17zy_celestials_lib_di';
// import { Observable, Subscription } from 'rxjs';

// import { SRService } from '../../core/service';
// import { LifecycleStreamData } from '../lifecycle';
// import { SoundModule } from './sound-module';
// import { WebAudioSound } from './web-audio-sound';


// // declare window.AudioContext
// declare global {
//     interface Window {
//         webkitAudioContext: typeof AudioContext;
//         AudioContext: typeof AudioContext;
//     }
// }

// /**
//  * 检查html5的WebAudioAPI是否可用
//  *
//  * @author Helcarin
//  * @export
//  * @returns {boolean}
//  */
// export function isWebAudioAvailable(): boolean {
//     return !!getAudioContextCtor();
// }

// function getAudioContextCtor(): typeof AudioContext | undefined {
//     return window.webkitAudioContext
//         || window.AudioContext
//         || undefined;
// }

// /**
//  * 声音管理器 with WebAudio API
//  *
//  * @author Helcarin
//  * @export
//  * @class WebAudioSoundManager
//  * @implements {SRService<SoundModule>}
//  */
// @SRService(SoundModule)
// export class WebAudioSoundManager implements SRService<SoundModule> {
//     public readonly module!: SoundModule;

//     @Inject('input:lifecycle$')
//     protected readonly lifecycle$!: Observable<LifecycleStreamData>;
//     protected lifecycleSubscription: Subscription | undefined;

//     /** 所有音频 */
//     protected sounds: Set<WebAudioSound> = new Set();
//     /**
//      * 所有音频
//      *
//      * @readonly
//      * @type {ReadonlySet<WebAudioSound>}
//      */
//     public getSounds(): ReadonlySet<WebAudioSound> {
//         return this.sounds;
//     }

//     /** AudioContext */
//     public readonly audioContext: AudioContext;


//     constructor() {
//         const ctor = getAudioContextCtor();
//         if (!ctor) {
//             throw new Error('WebAudio is not available');
//         }
//         this.audioContext = new ctor();
//     }

//     public onInitialized() {
//         this.lifecycleSubscription = this.lifecycle$.subscribe(data => {
//             if (data.visibility) {
//                 this.onResume();
//             } else {
//                 this.onSuspend();
//             }
//         });
//     }

//     /**
//      * 添加音频
//      * @param {WebAudioSound} sound
//      */
//     public addSound(sound: WebAudioSound) {
//         this.sounds.add(sound);
//     }

//     /**
//      * 移除音频
//      * @param {Sound} sound
//      */
//     public removeSound(sound: WebAudioSound) {
//         this.sounds.delete(sound);
//     }

//     /** 页面挂起时的处理 */
//     public onSuspend(): void {
//         if (this.audioContext.state === 'running') {
//             this.audioContext.suspend();
//         }
//     }

//     /** 页面从挂起中恢复时的处理 */
//     public onResume(): void {
//         if (this.audioContext.state === 'suspended') {
//             this.audioContext.resume();
//         }
//     }

//     /** 是否已解锁 */
//     private _unlocked: boolean = false;

//     /**
//      * 是否需要解锁
//      * @returns {boolean}
//      */
//     public needUnlock(): boolean {
//         if (this._unlocked) { return false; }
//         if (this.audioContext.state === 'closed') { return false; }

//         const isIos = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
//         return isIos;
//     }

//     /**
//      * 解锁。
//      * ios下在用户触发的交互中调用这个方法可以将该AudioContext解锁。
//      * @see https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html#//apple_ref/doc/uid/TP40009523-CH6-SW6
//      */
//     public unlock(): void {
//         // 创建一个最小长度的音频播放一下
//         const source = this.audioContext.createBufferSource();
//         const buff = this.audioContext.createBuffer(1, 1, 22050);
//         source.connect(this.audioContext.destination);
//         const onEnded = (event: MediaStreamErrorEvent) => {
//             source.removeEventListener('ended', onEnded);
//             source.stop();
//             source.disconnect();
//         };
//         source.addEventListener('ended', onEnded);
//         source.start(0);

//         this._unlocked = true;
//     }

//     public dispose(): void {
//         this.sounds.forEach(sound => sound.dispose());
//         this.sounds.clear();

//         if (this.lifecycleSubscription) {
//             this.lifecycleSubscription.unsubscribe();
//             this.lifecycleSubscription = undefined;
//         }

//         if (this.audioContext.state !== 'closed') {
//             this.audioContext.close();
//         }
//     }
// }
