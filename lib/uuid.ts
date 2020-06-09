const HexDigits: Array<string> = '0123456789abcdef-'.split('');

/**
 * 生成一个uuid
 * （version 4，variant 1）
 *
 * @author Helcarin
 * @export
 * @returns {string}
 */
export function getUuid(): string {
    let s: Array<any> = [];
    for (let i = 0; i < 36; i++) {
        s[i] = Math.random() * 0x10 >>> 0;
    }

    // 设置version位 = 4
    s[14] = 4;

    // 设置variant位 = 1 (10xx)
    s[19] = 0b1000 | 0b0011 & s[19];

    // 8-4-4-4-12
    s[8] = s[13] = s[18] = s[23] = 16;

    for (let i = 0; i < 36; i++) {
        s[i] = HexDigits[s[i]];
    }
    return s.join('');
}
