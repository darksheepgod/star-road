/**
 * now
 *
 * @author Helcarin
 * @export
 * @returns {number}
 */
let getNow: () => number;
// performance or Date
if (typeof performance === 'object' && performance != null && typeof performance.now === 'function') {
    const startTime = new Date().getTime() - performance.now();
    getNow = () => startTime + performance.now();
} else {
    getNow = () => new Date().getTime();
}
export { getNow };

/**
 * format date to hh:mm:ss:S
 *
 * @author Helcarin
 * @export
 * @param {(Date | number)} [d]     时间，默认为当前时间
 * @returns
 */
export function formatDate(d?: Date | number) {
    const date = d ? typeof d === 'number' ? new Date(d) : d : new Date();

    let hh = `0${date.getHours()}`;
    hh = hh.substr(hh.length - 2);

    let mm = `0${date.getMinutes()}`;
    mm = mm.substr(mm.length - 2);

    let ss = `0${date.getSeconds()}`;
    ss = ss.substr(ss.length - 2);

    let S = `00${date.getMilliseconds()}`;
    S = S.substr(S.length - 3);

    return `${hh}:${mm}:${ss}:${S}`;
}
