import { FrameTicker, TickerModule } from '../src/module/ticker';
import { formatDate, getNow } from '../src/utils/date';


export function testTicker() {

    const tm1 = new TickerModule();
    tm1.start();

    tm1.ticker$.subscribe((data) => {
        console.log(`[${formatDate()}] ticker: ${data.type}, ${formatDate(data.now)}, ${data.delay}`);
    });

    setTimeout(() => {
        tm1.dispose();
    }, 10000);

}
