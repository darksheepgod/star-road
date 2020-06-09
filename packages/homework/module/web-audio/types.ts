
/** 加载状态 */
export enum LoadState {
    /** 初始（未加载） */
    Initial,
    /** 加载中 */
    Loading,
    /** 加载完成 */
    Loaded,
    /** 错误 */
    Error,
}

/** 播放状态 */
export enum PlayState {
    /** 初始（未加载） */
    Initial,
    /** 缓冲中 */
    Buffering,
    /** 播放中 */
    Playing,
    /** 暂停中 */
    Paused,
    /** 中止 */
    Aborted,
    /** 结束 */
    Ended,
    /** 错误 */
    Error,
}
