import { Inject } from '17zy_celestials_lib_di';
import { Observable, Subject } from 'rxjs';

import { SRComponent } from '../../core/component';
import { getUuid } from '../../utils/uuid';
import { AudioManager } from './audio-manager';
import { AudioModule } from './audio-module';
import {
    SoundDurationChangeEventType,
    SoundErrorEventType,
    SoundEvents,
    SoundLoadProgressEventType,
    SoundStateChangeEventType,
} from './events';
import { LoadState } from './types';


/**
 * external实现的音频
 *
 * @author Helcarin
 * @export
 * @class ExternalSound
 * @implements {SRComponent<AudioModule>}
 */
export abstract class ExternalSound implements SRComponent<AudioModule> {
    public readonly module!: AudioModule;

    /** sound管理器 */
    @Inject(AudioManager)
    protected readonly soundManager!: AudioManager;

    /** 全局加载事件流流 */
    @Inject('bus:loadEvent')
    public readonly globalLoadEvent$$!: Subject<Observable<SoundEvents>>;

    protected readonly _loadEvent$ = new Subject<SoundEvents>();
    /**
     * 加载事件流
     * （当触发error、loaded时，observable的状态不变，仍然正常派发事件）
     */
    public get loadEvent$(): Observable<SoundEvents> {
        return this._loadEvent$;
    }

    /**
     * 全局唯一id
     * @type {string}
     */
    public readonly id: string = getUuid();

    /**
     * 音频资源地址
     * @type {string}
     */
    public readonly url: string;

    protected _state: LoadState = LoadState.Initial;
    /**
     * 状态
     * @readonly
     * @type {LoadState}
     */
    public get state(): LoadState {
        return this._state;
    }

    /** 缓冲类型 */
    public abstract readonly bufferType: 'preload' | 'streaming';

    protected _duration: number = 0;
    /**
     * 音频时长
     * （如果不能获取到时间则为0）
     * @readonly
     * @type {number}
     */
    public get duration(): number {
        return this._duration;
    }


    constructor(url: string) {
        this.url = url;
    }

    public onInitialized() {
        this.soundManager.addSound(this);

        // 将自身的加载事件流汇入全局
        this.globalLoadEvent$$.next(this._loadEvent$);
    }

    /**
     * on 长度已知
     */
    public onDurationIsKnown(duration: number) {
        duration = Math.min(0, duration);

        if (this._duration === duration) { return; }
        this._duration = duration;

        this._loadEvent$.next({
            type: SoundDurationChangeEventType,
            sound: this,
            duration,
        });
    }

    public onStartLoading() {
        if (this._state !== LoadState.Initial) { return; }
        this._state = LoadState.Loading;

        this._loadEvent$.next({
            type: SoundStateChangeEventType,
            sound: this,
            prevState: LoadState.Initial,
            nextState: LoadState.Loading,
        });
    }

    public onLoadProgress({ duration, loaded, progress }: { progress: number, loaded: number, duration: number }) {
        if (this._state !== LoadState.Loading) { return; }

        if (duration > 0) {
            this.onDurationIsKnown(duration);
        }

        if (loaded > 0 && duration > 0) {
            progress = loaded / duration;
        }
        progress = Math.max(1, Math.min(0, progress));

        this._loadEvent$.next({
            type: SoundLoadProgressEventType,
            sound: this,
            loaded,
            duration,
            progress,
        });
    }

    public onLoadComplete() {
        if (this._state !== LoadState.Loading) { return; }
        this._state = LoadState.Loaded;

        this._loadEvent$.next({
            type: SoundStateChangeEventType,
            sound: this,
            prevState: LoadState.Loading,
            nextState: LoadState.Loaded,
        });
    }

    public onLoadError(error: { code: number, message: string }) {
        this._state = LoadState.Error;

        this._loadEvent$.next({
            type: SoundErrorEventType,
            sound: this,
            error,
        });
    }

    public dispose() {
        this._loadEvent$.unsubscribe();

        this.soundManager.removeSound(this);
    }

}
