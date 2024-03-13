import MergeAdapter from "../components/adapters/MergeAdapter";
import ParallelizeAdapter from "../components/adapters/ParallelizeAdapter";
import Pipeline, { DataComponent } from "./Pipeline";

export default class PipelineFactory {

    static createETLPipeline(
        extractors: DataComponent[],
        transformers: DataComponent[],
        loaders: DataComponent[]) {
        return new Pipeline([
            new MergeAdapter(extractors),
            ...transformers,
            new ParallelizeAdapter(loaders)
        ]);
    }

    static createSimpleETLPipeline(
        extractor: DataComponent,
        transformer: DataComponent,
        loader: DataComponent) {
        return new Pipeline([
            extractor,
            transformer,
            loader
        ]);
    }
}