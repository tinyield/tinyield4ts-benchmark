import {AbstractSequenceBenchmark} from '../abstract-sequence-benchmark';
import {blackhole} from '../utils/benchmark-utils';
import {getCollectionSizeLabel} from '../utils/benchmark-cli-arguments';

export class FlatmapAndReduceBenchmark extends AbstractSequenceBenchmark {
    name(): string {
        return `Flatmap and Reduce ${getCollectionSizeLabel()}`;
    }

    ix(): void {
        blackhole(this.ixOps.flatMapAndReduce(this.ixUtils.getNested()));
    }

    lazy(): void {
        blackhole(this.lazyOps.flatMapAndReduce(this.lazyUtils.getNested()));
    }

    lodash(): void {
        blackhole(this.lodashOps.flatMapAndReduce(this.lodashUtils.getNested()));
    }

    tinyield(): void {
        blackhole(this.tinyieldOps.flatMapAndReduce(this.tinyieldUtils.getNested()));
    }

    underscore(): void {
        blackhole(this.underscoreOps.flatMapAndReduce(this.underscoreUtils.getNested()));
    }
}