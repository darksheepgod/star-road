import { Injector } from '17zy_celestials_lib_di';
import { Observable, Subject } from 'rxjs';
import { mergeAll } from 'rxjs/operators';
import { Type } from '../../../lib/types';

export interface Publisher {
    injector?: Injector;
    onStreamsCreated?(): void;
    dispose(): void;
}

/**
 * decorator, 声明为一个Publisher。
 * - 在构造函数的最后自动创建标记了@Stream、@Bus的Subject
 * - 在dispose时自动销毁这些subjects
 * - 必须在结构上提供dispose方法
 * - 可选：提供onStreamsCreated()方法，会在流创建完毕时立即调用
 *
 * @author Helcarin
 * @export
 * @returns
 */
export function Publisher() {
    return <TFunction extends Type<Publisher>>(target: TFunction): TFunction | void => {
        return class extends target {
            constructor(...args: Array<any>) {
                super(...args);
                createStreams(this);
            }

            public dispose() {
                removeStreams(this);
                super.dispose();
            }
        };
    };
}

export interface StreamDefine {
    propertyKey: string | symbol;
    injectionName?: string | symbol;
    type: 'stream' | 'bus';
}

export const METADATA_KEY_STREAM_DEFINES = Symbol('sr:streams');

export function _stream(type: 'stream' | 'bus', injectionName?: string): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        let defines = Reflect.getMetadata(METADATA_KEY_STREAM_DEFINES, target) as Set<StreamDefine>;
        if (!defines) { defines = new Set(); }
        defines.add({
            type,
            propertyKey,
            injectionName,
        });
        Reflect.defineMetadata(METADATA_KEY_STREAM_DEFINES, defines, target);
    };
}

/**
 * decorator, 自动创建一个流。
 * @see {Publisher}
 * @author Helcarin
 * @export
 * @param {string} [injectionName]      注入名称，如果传入，会用该名称添加到注入器中。（此时必须在实例上提供注入器）
 * @returns {PropertyDecorator}
 */
export function Stream(injectionName?: string): PropertyDecorator {
    return _stream('stream', injectionName);
}

/**
 * decorator, 声明bus流（二阶流）。
 * 会创建成一个二阶流（Subject<Observable>）并添加到注入器。
 * 实例上该属性会赋值成所创建的流的merge结果。
 *
 * @see {Publisher}
 * @author Helcarin
 * @export
 * @returns {PropertyDecorator}
 */
export function Bus(injectionName: string): PropertyDecorator {
    return _stream('bus', injectionName);
}


/**
 * 生成输入输出流
 *
 * @author Helcarin
 * @export
 * @param {Publisher} obj
 * @returns {void}
 */
export function createStreams(obj: Publisher): void {
    const defines = Reflect.getMetadata(METADATA_KEY_STREAM_DEFINES, obj.constructor.prototype) as Set<StreamDefine> | undefined;
    if (!defines) { return; }

    defines.forEach(({ type, propertyKey, injectionName }) => {
        let subject = new Subject<any>();
        if (type === 'bus') {
            const merged = (subject as Subject<Observable<any>>).pipe(mergeAll());
            Reflect.set(obj, propertyKey, merged);
        } else {
            Reflect.set(obj, propertyKey, subject);
        }

        // inject
        if (injectionName) {
            if (!obj.injector) {
                throw new Error(`使用injectionName时必须在实例上提供injector实例`);
            }
            obj.injector.addDependency(injectionName, subject);
        }
    });

    if (obj.onStreamsCreated) {
        obj.onStreamsCreated();
    }
}

/**
 * 销毁输入输出流
 *
 * @author Helcarin
 * @export
 * @param {Publisher} obj
 * @returns {void}
 */
export function removeStreams(obj: Publisher): void {
    const defines = Reflect.getMetadata(METADATA_KEY_STREAM_DEFINES, obj.constructor.prototype) as Set<StreamDefine> | undefined;
    if (!defines) { return; }

    defines.forEach(({ type, propertyKey }) => {
        const subject = Reflect.get(obj, propertyKey) as Subject<any>;
        if (!subject) { return; }

        subject.unsubscribe();
    });
}
