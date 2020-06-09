import { ExternalAudioPlayer } from './player';
import { ExternalSound } from './sound';
import { LoadState, PlayState } from './types';


export type SoundEvents = SoundStateChangeEvent | SoundDurationChangeEvent | SoundLoadProgressEvent | SoundErrorEvent;


export const SoundStateChangeEventType = Symbol('soundStateChange');
/**
 * sound状态事件
 */
export interface SoundStateChangeEvent {
    type: typeof SoundStateChangeEventType;

    sound: ExternalSound;

    /**
     * 上个状态
     * @type {LoadState}
     */
    prevState: LoadState;

    /**
     * 下个状态
     * @type {LoadState}
     */
    nextState: LoadState;
}

export const SoundDurationChangeEventType = Symbol('soundDurationChange');
/**
 * 长度事件
 */
export interface SoundDurationChangeEvent {
    type: typeof SoundDurationChangeEventType;

    sound: ExternalSound;

    duration: number;
}

export const SoundLoadProgressEventType = Symbol('soundLoadProgress');
/**
 * 加载进度事件
 */
export interface SoundLoadProgressEvent {
    type: typeof SoundLoadProgressEventType;

    /**
     * 音频
     * @type {ExternalSound}
     */
    sound: ExternalSound;

    /**
     * 总时长（ms）
     * 有可能为0，表示尚未获取到，或者不支持获取
     * @type {number}
     */
    duration: number;

    /**
     * 当前加载时长（ms）
     * 有可能为0
     * @type {number}
     */
    loaded: number;

    /**
     * 进度(0-1)
     * 当获取不到总时长的时候，加载事件只传进度
     * @type {number}
     */
    progress: number;
}

export const SoundErrorEventType = Symbol('soundError');
/**
 * 错误事件
 */
export interface SoundErrorEvent {
    type: typeof SoundErrorEventType;

    sound: ExternalSound;

    error: { code: number, message: string };
}


export type PlayerEvents = PlayerStateChangeEvent | PlayerPlayProgressEvent | PlayerErrorEvent;

export const PlayerStateChangeEventType = Symbol('playerStateChange');
/**
 * 播放状态变化事件
 * （开始buffer/开始play/pause/resume时触发）
 */
export interface PlayerStateChangeEvent {
    type: typeof PlayerStateChangeEventType;

    player: ExternalAudioPlayer;

    /**
     * 上个状态
     * @type {PlayState}
     */
    prevState: PlayState;

    /**
     * 下个状态
     * @type {PlayState}
     */
    nextState: PlayState;
}

export const PlayerPlayProgressEventType = Symbol('playerPlayProgress');
/**
 * 播放进度事件
 */
export interface PlayerPlayProgressEvent {
    type: typeof PlayerPlayProgressEventType;

    player: ExternalAudioPlayer;

    /**
     * 当前播放位置（ms）
     * @type {number}
     */
    currentTime: number;

    /**
     * 总时长（ms）
     * 有可能为0，表示尚未获取到，或者不支持获取
     * @type {number}
     */
    duration: number;
}

export const PlayerErrorEventType = Symbol('playerError');
/**
 * 播放错误事件
 */
export interface PlayerErrorEvent {
    type: typeof PlayerErrorEventType;

    player: ExternalAudioPlayer;

    error: { code: number, message: string };
}
