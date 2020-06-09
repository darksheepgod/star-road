/**
 * 日志级别
 *
 * @export
 * @enum {number}
 */
export enum LogLevel {
    Emerg = 0,
    Alert = 1,
    Crit = 2,
    Err = 3,
    Warning = 4,
    Notice = 5,
    Info = 6,
    Debug = 7,
}

export interface LogStreamData {
    /**
     * 频道
     * @type {string}
     */
    channel?: string;

    /**
     * 级别
     * @type {number}
     */
    level: number;

    /**
     * 内容
     * @type {string}
     */
    message: string;
}
