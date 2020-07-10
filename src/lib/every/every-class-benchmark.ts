import {blackhole} from '../utils/benchmark-utils';
import {Value} from '../operations/model/wrapper/value';
import {AbstractZipBenchmark} from '../zip/abstract-zip-benchmark';
import {getCollectionSizeLabel} from '../utils/benchmark-cli-arguments';

export class EveryClassBenchmark extends AbstractZipBenchmark {
    name(): string {
        return `Every Class ${getCollectionSizeLabel()}`;
    }

    ix(): void {
        blackhole(this.ixOps.every<Value, Value>(this.ixUtils.getValues(), this.ixUtils.getValues(), (a, b) => a.text === b.text));
    }

    lazy(): void {
        blackhole(this.lazyOps.every<Value, Value>(this.lazyUtils.getValues(), this.lazyUtils.getValues(), (a, b) => a.text === b.text));
    }

    lodash(): void {
        blackhole(
            this.lodashOps.every<Value, Value>(this.lodashUtils.getValues(), this.lodashUtils.getValues(), (a, b) => a.text === b.text)
        );
    }

    tinyield(): void {
        blackhole(
            this.tinyieldOps.every<Value, Value>(
                this.tinyieldUtils.getValues(),
                this.tinyieldUtils.getValues(),
                (a, b) => a.text === b.text
            )
        );
    }

    underscore(): void {
        blackhole(
            this.underscoreOps.every<Value, Value>(
                this.underscoreUtils.getValues(),
                this.underscoreUtils.getValues(),
                (a, b) => a.text === b.text
            )
        );
    }

    zipline(): void {
        blackhole(
            this.ziplineOps.every<Value, Value>(this.ziplineUtils.getValues(), this.ziplineUtils.getValues(), (a, b) => a.text === b.text)
        );
    }
}
