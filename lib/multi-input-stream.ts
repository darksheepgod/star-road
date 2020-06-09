import { Observable, Subject } from 'rxjs';

/**
 * 将数量可变的多个输入流合并至一个输出流的工具类，
 * 内部使用switch操作。
 * 相比直接merge二阶流的区别是可以在内部流未完成的情况下随时动态增删输入。
 *
 * @author Helcarin
 * @export
 * @class DynamicInputsMergedStream
 * @template T
 */
export class DynamicInputsMergedStream<T> {
    private readonly _output$: Observable<T>;
    public get output$(): Observable<T> {
        return this._output$;
    }

    /** 记录input列表 */
    private readonly inputs: Array<Observable<T>> = [];
    /**
     * input列表的流，
     * 正常情况下输出input[]，将其merge后做switch处理输出到output$中，
     * 当dispose时，输出null，用于向switch流输出complete状态
     */
    private readonly inputs$: Subject<Array<Observable<T>> | null> = new Subject();

    constructor() {
        this._output$ = this.inputs$.switchMap(inputs => inputs ? Observable.merge(...inputs) : Observable.empty<T>());
    }

    public addInput(input: Observable<T>) {
        if (this.inputs.indexOf(input) > -1) { return; }

        this.inputs.push(input);
        this.inputs$.next(this.inputs);
    }

    public removeInput(input: Observable<T>) {
        const index = this.inputs.indexOf(input);
        if (index < 0) { return; }

        this.inputs.splice(index);
        this.inputs$.next(this.inputs);
    }

    public dispose() {
        this.inputs.length = 0;
        this.inputs$.next(null);
        this.inputs$.complete();
        this.inputs$.unsubscribe();
    }

}
