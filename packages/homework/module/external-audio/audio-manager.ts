import { Inject } from '17zy_celestials_lib_di';
import { merge, Observable, Subscription, pipe } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { SRService } from '../../core/service';
import { LifecycleStreamData } from '../lifecycle';
import { AudioModule } from './audio-module';
import {
    PlayerErrorEvent,
    PlayerErrorEventType,
    PlayerStateChangeEventType,
    SoundErrorEvent,
    SoundErrorEventType,
} from './events';
import { ExternalAudioPlayer, ExternalAudioPlayParam } from './player';
import { ExternalPreloadSound } from './preload-sound';
import { ExternalSound } from './sound';
import { ExternalStreamingSound } from './streaming-sound';
import { PlayState } from './types';


pipe(filter((item: any) => item.name === '111'))


/**
 * 声音管理器
 *
 * @author Helcarin
 * @export
 * @class AudioManager
 * @implements {SRService<AudioModule>}
 */
@SRService(AudioModule)
export class AudioManager implements SRService<AudioModule> {
    public readonly module!: AudioModule;

    @Inject('input:lifecycle$')
    protected readonly lifecycle$!: Observable<LifecycleStreamData>;
    protected lifecycleSubscription: Subscription | undefined;


    constructor() {
    }

    public onInitialized() {
        this.lifecycleSubscription = this.lifecycle$.subscribe(data => {
            if (data.visibility) {
                this.onResume();
            } else {
                this.onSuspend();
            }
        });
    }

    /** 所有音频 */
    protected sounds: Set<ExternalSound> = new Set();

    /**
     * 所有音频
     * @type {ReadonlySet<ExternalSound>}
     */
    public getSounds(): ReadonlySet<ExternalSound> {
        return this.sounds;
    }

    /**
     * 添加音频
     * @param {ExternalSound} sound
     */
    public addSound(sound: ExternalSound) {
        this.sounds.add(sound);
    }

    /**
     * 移除音频
     * @param {ExternalSound} sound
     */
    public removeSound(sound: ExternalSound) {
        this.sounds.delete(sound);
    }

    /** 所有播放器 */
    protected players: Set<ExternalAudioPlayer> = new Set();

    /**
     * 所有播放器
     * @returns {ReadonlySet<ExternalAudioPlayer>}
     */
    public getPlayers(): ReadonlySet<ExternalAudioPlayer> {
        return this.players;
    }

    /**
     * 添加音频播放器
     * @param {ExternalAudioPlayer} player
     */
    public addPlayer(player: ExternalAudioPlayer) {
        this.players.add(player);
    }

    /**
     * 移除音频播放器
     * @param {ExternalAudioPlayer} player
     */
    public removePlayer(player: ExternalAudioPlayer) {
        this.players.delete(player);
    }

    /** 页面挂起时的处理 */
    public onSuspend(): void {
        // 恢复时再处理
    }

    /** 页面从挂起中恢复时的处理 */
    public onResume(): void {
        this.players.forEach(player => {
            // 1. 挂起时外壳会使播放器处于中断状态
            // 2. 这里只处理了无限循环的，有限次数的无法限定业务逻辑就不处理了
            if (player.state === PlayState.Aborted && player.loop) {
                player.play({
                    startTime: player.currentTime,
                    loop: true,
                    volume: player.volume,
                    playbackRate: player.playbackRate,
                });
            }
        });
    }

    /**
     * 加载并播放。
     * 返回一个Promise，当播放完毕时resolve, 加载或播放错误时reject。
     * （完成或错误时自动销毁创建的Sound和Player对象）
     * （不可循环）
     *
     * @author Helcarin
     * @param {string} url
     * @param {('preload' | 'streaming')} [bufferType='preload']
     * @param {ExternalAudioPlayParam} [playParam]
     * @returns {Promise<void>}
     */
    public loadAndPlay({ url, bufferType = 'preload', playParam }: { url: string, bufferType: 'preload' | 'streaming', playParam?: ExternalAudioPlayParam }): Promise<void> {
        return new Promise((resolve, reject) => {
            const sound = bufferType === 'streaming' ?
                this.module.getComponent(ExternalStreamingSound, url) :
                this.module.getComponent(ExternalPreloadSound, url);

            // 不能循环
            playParam = { ...playParam, ...{ loop: false } };
            const player = this.module.getComponent(ExternalAudioPlayer, sound);
            player.play(playParam);

            // error
            const err1$ = sound.loadEvent$.pipe(filter((event): event is SoundErrorEvent => event.type === SoundErrorEventType));
            const err2$ = player.playEvent$.pipe(filter((event): event is PlayerErrorEvent => event.type === PlayerErrorEventType));

            merge(err1$, err2$)
                .pipe(first())
                .subscribe(event => {
                    player.dispose();
                    sound.dispose();
                    reject({ error: event.error });
                });

            const complete$ = player.playEvent$.pipe(filter(event => (
                event.type === PlayerStateChangeEventType
                && (event.nextState === PlayState.Ended || event.nextState === PlayState.Aborted)
            )));
            complete$
                .pipe(first())
                .subscribe({
                    complete() {
                        player.dispose();
                        sound.dispose();
                        resolve();
                    },
                });
        });
    }

    public dispose(): void {
        this.sounds.forEach(sound => sound.dispose());
        this.sounds.clear();

        this.players.forEach(player => player.dispose());
        this.players.clear();

        if (this.lifecycleSubscription) {
            this.lifecycleSubscription.unsubscribe();
            this.lifecycleSubscription = undefined;
        }
    }

}
