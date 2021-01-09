import {getCLIArguments, getCollectionSizeLabel} from '../utils/benchmark-cli-arguments';
import {IterableX} from 'ix/iterable';
import * as Lazy from 'lazy.js';
import * as _ from 'lodash';
import {Query} from 'tinyield4ts';
import {asSequence} from 'sequency';
import * as __ from 'underscore';
import {zip} from '../common/extensions/array-extensions';
import {getSuite, options} from '../utils/benchmark-utils';
import {ARRAYS, IX, LAZY, LODASH, SEQUENCY, TINYIELD, UNDERSCORE} from '../common/constants';
import {Benchmark} from '../benchmark';
import 'ix/add/iterable-operators/zip';
import 'ix/add/iterable-operators/map';
import 'ix/add/iterable-operators/filter';
import 'ix/add/iterable-operators/first';

/**
 * FindStringBenchmark
 * The `find` between two sequences is an operation that, based on a user defined
 * predicate, finds two elements that match, returning one of them in the process.
 * <p>
 * Pipeline:
 * Sequence.of("1", "2",...)
 * .zip(Sequence.of("1", "2",...), (elem1, elem2) => elem1 === elem2 ? elem1 : undefined)
 * .filter(elem => elem !== undefined)
 * .first();
 */
export class FindStringBenchmark implements Benchmark {
    /**
     * The size of the Sequence for this benchmark
     */
    public COLLECTION_SIZE: number;

    /**
     * An array containing strings initiated with integers from 0 to COLLECTION_SIZE
     */
    public a: string[];

    /**
     * An array containing strings initiated with -1
     */
    public b: string[];

    /**
     * The current match index, is updated per iteration
     */
    public index: number;

    /**
     * Gets an {string[]} with size COLLECTION_SIZE
     *
     * @returns {string[]} of size COLLECTION_SIZE
     */
    public getStrings(matcher = false, values: string[] = []): string[] {
        if (matcher) {
            for (let i = 0; i < this.COLLECTION_SIZE; i++) {
                values[i] = '-1';
            }
        } else {
            for (let i = 0; i < this.COLLECTION_SIZE; i++) {
                values[i] = `${i}`;
            }
        }
        return values;
    }

    /**
     * Gets a {string} stating the name of this benchmark to better identify it
     * in the benchmark logs.
     *
     * @returns {string} that identifies this benchmark
     */
    name(): string {
        return `Find String ${getCollectionSizeLabel()}`;
    }

    /**
     * Resets data sources and index to initial state
     */
    reset(): void {
        this.index = 0;
        this.b = this.getStrings(true, this.b);
    }

    /**
     * Sets up the data sources to be used in this benchmark
     */
    setup() {
        this.index = 0;
        this.COLLECTION_SIZE = getCLIArguments().size;
        this.a = this.getStrings();
        this.b = this.getStrings(true);
    }

    /**
     * Updates the match index with each Invocation
     */
    update(): void {
        this.b[(this.index - 1) % this.COLLECTION_SIZE] = `${-1}`;
        this.b[this.index % this.COLLECTION_SIZE] = `${this.index % this.COLLECTION_SIZE}`;
        this.index++;
    }

    /**
     * Zips two sequences of {@external IterableX} together, comparing zipped element's values to let any through
     * if a match is made or null otherwise
     *
     * @returns {string} the found string if a match was found, null otherwise.
     */
    ix(): string {
        this.update();
        return IterableX.of(...this.a)
            .zip(IterableX.of(...this.b))
            .map(([elem1, elem2]) => (elem1 === elem2 ? elem1 : undefined))
            .filter(elem => elem !== undefined)
            .first();
    }

    /**
     * Zips two sequences of {@external Lazy} together, comparing zipped element's values to let any through
     * if a match is made or null otherwise
     *
     * @returns {string} the found string if a match was found, null otherwise.
     */
    lazy(): string {
        this.update();
        return (Lazy(this.a).zip(this.b) as any)
            .map(([elem1, elem2]: string[]) => (elem1 === elem2 ? elem1 : undefined))
            .filter((elem: string) => elem !== undefined)
            .first();
    }

    /**
     * Zips two sequences of {@external _.LoDashStatic} together, comparing zipped element's values to let any through
     * if a match is made or null otherwise
     *
     * @returns {string} the found string if a match was found, null otherwise.
     */
    lodash(): string {
        this.update();
        return _.chain(this.a)
            .zipWith(_.chain(this.b).value(), (elem1, elem2) => (elem1 === elem2 ? elem1 : undefined))
            .filter(elem => elem !== undefined)
            .first()
            .value();
    }

    /**
     * Zips two sequences of {@external Query} together, comparing zipped element's values to let any through
     * if a match is made or null otherwise
     *
     * @returns {string} the found string if a match was found, null otherwise.
     */
    tinyield(): string {
        this.update();
        return Query.of(this.a)
            .zip(Query.of(this.b), (elem1, elem2) => (elem1 === elem2 ? elem1 : undefined))
            .filter(elem => elem !== undefined)
            .first();
    }

    /**
     * Zips two sequences of {@external Sequence} together, comparing zipped element's values to let any through
     * if a match is made or null otherwise
     *
     * @returns {string} the found string if a match was found, null otherwise.
     */
    sequency(): string {
        this.update();
        return asSequence(this.a)
            .zip(asSequence(this.b))
            .map(([elem1, elem2]) => (elem1 === elem2 ? elem1 : undefined))
            .filter(elem => elem !== undefined)
            .first();
    }

    /**
     * Zips two sequences of {@external __.UnderscoreStatic} together, comparing zipped element's values to let any through
     * if a match is made or null otherwise
     *
     * @returns {string} the found string if a match was found, null otherwise.
     */
    underscore(): string {
        this.update();
        return (__.chain(this.a).zip(__.chain(this.b).value()) as any)
            .map(([elem1, elem2]: string[]) => (elem1 === elem2 ? elem1 : undefined))
            .filter((elem: string) => elem !== undefined)
            .first()
            .value();
    }

    /**
     * Zips two sequences of {@external Array} together, comparing zipped element's values to let any through
     * if a match is made or null otherwise
     *
     * @returns {string} the found string if a match was found, null otherwise.
     */
    arrays(): string {
        this.update();
        return zip([...this.a], [...this.b])
            .map(pair => (pair.left === pair.right ? pair.left : undefined))
            .find(elem => elem !== undefined);
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
            .on('cycle', () => this.reset())
            .run(options());
    }
}
