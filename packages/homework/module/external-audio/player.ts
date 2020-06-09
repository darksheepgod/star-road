import { Inject } from '17zy_celestials_lib_di';
import { audio2 } from '17zy_celestials_lib_external';
import { ExternalAudio2PlayCallbackParams } from '17zy_celestials_lib_external/audio2/audio2-play';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SRComponent } from '../../core/component';
import { AudioManager } from './audio-manager';
import { AudioModule } from './audio-module';
import {
    PlayerErrorEventType,
    PlayerEvents,
    PlayerPlayProgressEventType,
    PlayerStateChangeEventType,
    SoundStateChangeEventType,
} from './events';
import { ExternalPreloadSound } from './preload-sound';
import { ExternalSound } from './sound';
import { LoadState, PlayState } from './types';


/**
 * 声音播放参数
 * @export
 * @interface ExternalPlayParam
 */
export interface ExternalAudioPlayParam {
    /**
     * 开始时间
     * @type {number}
     */
    startTime?: number;

    /**
     * 循环
     * @type {boolean}
     */
    loop?: boolean;

    /**
     * 音量（[0, 1]）
     * @type {number}
     */
    volume?: number;

    /**
     * 播放速率
     * （目前无效）
     * @type {number}
     */
    playbackRate?: number;
}


/**
 * external实现的音频播放器
 *   - 由于external接口规定，页面挂起时所有播放器全部自动中断，故此类的实例会停留在aborted状态。挂起后恢复时会从中断位置开始继续播放。
 *   - 不会自动销毁。调用者应监听aborted和ended事件自行决定。
 *
 * @author Helcarin
 * @export
 * @class ExternalAudioPlayer
 * @implements {SRComponent<AudioModule>}
 */
@SRComponent(AudioModule)
export class ExternalAudioPlayer implements SRComponent<AudioModule> {
    /** module */
    public readonly module!: AudioModule;

    /** sound管理器 */
    @Inject(AudioManager)
    protected readonly soundManager!: AudioManager;

    /**
     * external player id
     * @private
     * @type {string}
     */
    private externalPlayerId: string = '';

    /**
     * 声音资源
     * @type {ExternalSound}
     */
    public readonly sound: ExternalSound;

    protected readonly _playEvent$ = new Subject<PlayerEvents>();
    /**
     * 播放事件流
     * @readonly
     * @type {Observable<SoundPlayEvent>}
     */
    public get playEvent$(): Observable<PlayerEvents> {
        return this._playEvent$;
    }

    /**
     * 全局播放事件流
     * @protected
     */
    @Inject('output:playEvent$$')
    protected readonly globalPlayEvent$$!: Subject<Observable<PlayerEvents>>;

    /**
     * 播放状态
     * @type {PlayState}
     */
    protected _state: PlayState = PlayState.Initial;
    public get state(): PlayState {
        return this._state;
    }

    /**
     * 当前播放进度（ms）
     * @type {number}
     */
    protected _currentTime: number = 0;
    public get currentTime(): number {
        return this._currentTime;
    }

    protected _loop: boolean = false;
    /** 参数：循环 */
    public get loop(): boolean {
        return this._loop;
    }

    protected _volume: number = 1;
    /** 参数：音量（[0,1]） */
    public get volume(): number {
        return this._volume;
    }
    public set volume(value: number) {
        if (this._volume !== value) {
            this._volume = value;
            if (this.externalPlayerId) {
                audio2.setVolume(this.externalPlayerId, this._volume);
            }
        }
    }

    protected _playbackRate: number = 1;
    /** 参数：速率（目前无效） */
    public get playbackRate(): number {
        return this._playbackRate;
    }
    public set playbackRate(value: number) {
        if (this._playbackRate !== value) {
            this._playbackRate = value;
            // 目前外壳不支持
        }
    }

    /** 参数：开始位置 */
    protected startTime: number = 0;

    protected waitForLoadingSubscription: Subscription | undefined = undefined;


    constructor(sound: ExternalSound) {
        this.sound = sound;
    }

    public onInitialized() {
        this.soundManager.addPlayer(this);

        // 将自身的播放事件流汇入全局
        this.globalPlayEvent$$.next(this._playEvent$);
    }

    /**
     * 播放
     * - 只在初始、结束、中止状态下可用
     * - 对于preload sound，调用play后进入buffering状态，等待sound加载完开始播放（如果sound未开始加载则自动开始）。
     * - 对于streaming sound，调用play后立即开始播放，暂时未处理buffer的状态问题。buffer回调会触发sound的加载事件。
     */
    public play({ startTime = 0, loop = false, volume = 1, playbackRate = 1 }: ExternalAudioPlayParam = {}): void {
        if (this._state !== PlayState.Initial && this._state !== PlayState.Aborted && this._state !== PlayState.Ended) { return; }

        if (startTime > 0) {
            this.startTime = startTime;
        }

        this._loop = !!loop;

        if (volume > 0 || volume === 0) {
            this._volume = Math.max(0, Math.min(1, volume)) || 1;
        }

        if (playbackRate > 0) {
            this._playbackRate = playbackRate;
        }

        Promise.resolve().then(() => {
            if (this.sound.bufferType === 'preload') {
                // 如果是preload类型，需要等sound加载完
                const sound = this.sound as ExternalPreloadSound;
                if (sound.state === LoadState.Loaded) {
                    this._play();
                } else {
                    // 先变为buffer状态
                    this._state = PlayState.Buffering;
                    this._playEvent$.next({
                        type: PlayerStateChangeEventType,
                        player: this,
                        prevState: PlayState.Initial,
                        nextState: PlayState.Buffering,
                    });

                    // 等待加载完成
                    this.waitForLoadingSubscription = sound.loadEvent$
                        .pipe(filter(event => event.type === SoundStateChangeEventType && event.nextState === LoadState.Loaded))
                        .subscribe(() => {
                            if (this.waitForLoadingSubscription) {
                                this.waitForLoadingSubscription.unsubscribe();
                                this.waitForLoadingSubscription = undefined;
                            }
                            if (this._state === PlayState.Buffering) {
                                this._play();
                            }
                        });

                    // 自动开始加载
                    if (sound.state === LoadState.Initial) {
                        sound.load();
                    }
                }
            } else {
                // 如果是流式，直接开始播放
                this._play();
            }
        });
    }

    /** 开始播放 */
    protected _play() {
        // 创建external播放器
        this.createExternalPlayer();

        const prevState = this._state;
        this._state = PlayState.Playing;
        this._currentTime = 0;

        // dispatch
        this._playEvent$.next({
            type: PlayerStateChangeEventType,
            player: this,
            prevState,
            nextState: PlayState.Playing,
        });

        // start time
        if (this.startTime > 0) {
            this.seekTo(this.startTime);
        }

        audio2.play(this.externalPlayerId, { streaming: this.sound.bufferType === 'streaming' });
    }

    /**
     * 初始化external播放器
     */
    protected createExternalPlayer(): void {
        this.externalPlayerId = audio2.initPlayer({
            url: this.sound.url,
            callback: params => this.onExternalCallback(params),
        });
    }

    /**
     * 暂停
     * - 只在playing状态下生效
     */
    public pause(): void {
        if (this._state !== PlayState.Playing) { return; }

        this._state = PlayState.Paused;
        this._playEvent$.next({
            type: PlayerStateChangeEventType,
            player: this,
            prevState: PlayState.Playing,
            nextState: PlayState.Paused,
        });

        audio2.pause(this.externalPlayerId);
    }

    /**
     * 恢复
     * - 只在paused状态下生效
     */
    public resume(): void {
        if (this._state !== PlayState.Paused) { return; }

        this._state = PlayState.Playing;
        this._playEvent$.next({
            type: PlayerStateChangeEventType,
            player: this,
            prevState: PlayState.Paused,
            nextState: PlayState.Playing,
        });

        audio2.resume(this.externalPlayerId);
    }

    /**
     * 跳转
     * - 如果尚未开始播放，等同于设置开始播放时间startTime
     * @param {number} time     时间（秒）
     */
    public seekTo(time: number): void {
        const duration = this.sound.duration;
        time = Math.max(0, Math.floor(time)) || 0;
        if (duration > 0) {
            time = Math.min(duration, time);
        }

        switch (this._state) {
            case PlayState.Initial:
            case PlayState.Buffering:
                this.startTime = time;
                break;
            case PlayState.Playing:
            case PlayState.Paused:
                this._currentTime = time;
                audio2.seekTo(this.externalPlayerId, time);
                break;
            default:
        }

        this._playEvent$.next({
            type: PlayerPlayProgressEventType,
            player: this,
            currentTime: time,
            duration: duration,
        });
    }

    /**
     * 停止
     */
    public stop(): void {
        const prevState = this._state;
        this._state = PlayState.Aborted;
        this._playEvent$.next({
            type: PlayerStateChangeEventType,
            player: this,
            prevState,
            nextState: this._state,
        });

        audio2.stop(this.externalPlayerId);
    }

    /**
     * 外壳播放器的回调
     */
    protected onExternalCallback(param: ExternalAudio2PlayCallbackParams): void {
        switch (param.state) {
            // 播放进度
            case 'playing':
                if (this._state === PlayState.Playing) {
                    this._currentTime = param.currentTime || 0;
                    this._playEvent$.next({
                        type: PlayerPlayProgressEventType,
                        player: this,
                        currentTime: this._currentTime,
                        duration: this.sound.duration,
                    });
                }
                break;

            // 中断
            case 'stopped':
                if (this._state !== PlayState.Aborted && this._state !== PlayState.Ended && this._state !== PlayState.Error) {
                    const prevState = this._state;
                    this._state = PlayState.Aborted;
                    this._playEvent$.next({
                        type: PlayerStateChangeEventType,
                        player: this,
                        prevState,
                        nextState: this._state,
                    });
                }
                break;

            // 自然停止
            case 'ended':
                if (this._state !== PlayState.Aborted && this._state !== PlayState.Ended && this._state !== PlayState.Error) {
                    // 如果是循环的，自动重新开始播放
                    if (this.loop) {
                        Promise.resolve().then(() => {
                            this.startTime = 0;
                            this._play();
                        });
                    } else {
                        const prevState = this._state;
                        this._state = PlayState.Ended;
                        this._playEvent$.next({
                            type: PlayerStateChangeEventType,
                            player: this,
                            prevState,
                            nextState: this._state,
                        });
                    }
                }
                break;

            case 'error':
                if (this._state !== PlayState.Error) {
                    this._state = PlayState.Error;
                    const code = param.errorCode || 59998;
                    const message = '音频播放错误';
                    this._playEvent$.next({
                        type: PlayerErrorEventType,
                        player: this,
                        error: { code, message },
                    });
                }
                break;

            default:
        }
    }

    public dispose(): void {
        this.soundManager.removePlayer(this);

        if (!this._playEvent$.closed) {
            this._playEvent$.unsubscribe();
        }

        if (this.waitForLoadingSubscription) {
            this.waitForLoadingSubscription.unsubscribe();
            this.waitForLoadingSubscription = undefined;
        }
    }

    public toString(): string {
        return `[${this.constructor.name}]<ext-${this.externalPlayerId}>`;
    }
}
