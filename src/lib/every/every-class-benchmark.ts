import {Value} from '../common/model/wrapper/value';
import {getCLIArguments, getCollectionSizeLabel} from '../utils/benchmark-cli-arguments';
import {IterableX} from 'ix/iterable';
import * as Lazy from 'lazy.js';
import * as _ from 'lodash';
import * as __ from 'underscore';
import {Query} from 'tinyield4ts';
import {asSequence} from 'sequency';

import 'ix/add/iterable-operators/zip';
import 'ix/add/iterable-operators/map';
import 'ix/add/iterable-operators/every';
import {zip} from '../common/extensions/array-extensions';
import {Benchmark} from '../benchmark';
import {getSuite, options} from '../utils/benchmark-utils';
import {ARRAYS, IX, LAZY, LODASH, SEQUENCY, TINYIELD, UNDERSCORE} from '../common/constants';

/**
 * EveryClassBenchmark
 * Every is an operation that, based on a user defined predicate, tests if all the
 * elements of a sequence match between corresponding positions.
 * <p>
 * Pipeline:
 * Sequence.of(new Value(1), new Value(2),..., new Value(...))
 * .zip(Sequence.of(new Value(1), new Value(2),..., new Value(...)), (elem1, elem2) => elem1.text === elem2.text)
 * .allMatch(elem => elem);
 */
export class EveryClassBenchmark implements Benchmark {
    /**
     * The size of the Sequence for this benchmark
     */
    public COLLECTION_SIZE: number;
    /**
     * The data source used to benchmark
     * This data is instantiated using the getValues method.
     */
    public data: Value[];

    /**
     * Gets a {string} stating the name of this benchmark to better identify it
     * in the benchmark logs.
     *
     * @returns {string} that identifies this benchmark
     */
    name(): string {
        return `Every Class ${getCollectionSizeLabel()}`;
    }

    /**
     * Gets an {Value[]} with size COLLECTION_SIZE
     *
     * @returns {Value[]} of size COLLECTION_SIZE
     */
    public getValues(): Value[] {
        const values = [];
        for (let i = 0; i < this.COLLECTION_SIZE; i++) {
            values.push(new Value(i));
        }
        return values;
    }

    /**
     * Sets up the data source to be used in this benchmark
     */
    setup(): void {
        this.COLLECTION_SIZE = getCLIArguments().size;
        this.data = this.getValues();
    }

    /**
     * Zips two sequences of {@external IterableX} together mapping the combination of each value to a boolean.
     *
     * @returns {boolean} true if all values in the zipped sequence are true, false otherwise.
     */
    ix(): boolean {
        return IterableX.of(...this.data)
            .zip(IterableX.of(...this.data))
            .map(([elem1, elem2]) => elem1.text === elem2.text)
            .every(elem => elem);
    }

    /**
     * Zips two sequences of {@external Lazy} together mapping the combination of each value to a boolean.
     *
     * @returns {boolean} true if all values in the zipped sequence are true, false otherwise.
     */
    lazy(): boolean {
        return (Lazy(this.data).zip(this.data) as any)
            .map(([elem1, elem2]: Value[]) => elem1.text === elem2.text)
            .every((elem: boolean) => elem);
    }

    /**
     * Zips two sequences of {@external _.LoDashStatic} together mapping the combination of each value to a boolean.
     *
     * @returns {boolean} true if all values in the zipped sequence are true, false otherwise.
     */
    lodash(): boolean {
        return _.chain(this.data)
            .zipWith(_.chain(this.data).value(), (elem1, elem2) => elem1.text === elem2.text)
            .every(elem => elem)
            .value();
    }

    /**
     * Zips two sequences of {@external Query} together mapping the combination of each value to a boolean.
     *
     * @returns {boolean} true if all values in the zipped sequence are true, false otherwise.
     */
    tinyield(): boolean {
        return Query.of(this.data)
            .zip(Query.of(this.data), (elem1, elem2) => elem1.text === elem2.text)
            .allMatch(elem => elem);
    }

    /**
     * Zips two sequences of {@external Sequence} together mapping the combination of each value to a boolean.
     *
     * @returns {boolean} true if all values in the zipped sequence are true, false otherwise.
     */
    sequency(): boolean {
        return asSequence(this.data)
            .zip(asSequence(this.data))
            .map(([elem1, elem2]) => elem1.text === elem2.text)
            .all(elem => elem);
    }

    /**
     * Zips two sequences of {@external __.UnderscoreStatic} together mapping the combination of each value to a boolean.
     *
     * @returns {boolean} true if all values in the zipped sequence are true, false otherwise.
     */
    underscore(): boolean {
        return (__.chain(this.data).zip(__.chain(this.data).value()) as any)
            .map(([elem1, elem2]: Value[]) => elem1.text === elem2.text)
            .every((elem: boolean) => elem)
            .value();
    }

    /**
     * Zips two sequences of {@external Array} together mapping the combination of each value to a boolean.
     *
     * @returns {boolean} true if all values in the zipped sequence are true, false otherwise.
     */
    arrays(): boolean {
        return zip([...this.data], [...this.data])
            .map(pair => pair.left.text === pair.right.text)
            .every(elem => elem);
    }

    run(): void {
        this.setup();
        const opts = options();
        getSuite(this.name())
            .add(UNDERSCORE, () => this.underscore(), opts)
            .add(TINYIELD, () => this.tinyield(), opts)
            .add(SEQUENCY, () => this.sequency(), opts)
            .add(LODASH, () => this.lodash(), opts)
            .add(ARRAYS, () => this.arrays(), opts)
            .add(LAZY, () => this.lazy(), opts)
            .add(IX, () => this.ix(), opts)
            .run(options());
    }
}
