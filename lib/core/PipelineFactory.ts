import MergeAdapter from "../components/adapters/MergeAdapter";
import ParallelizeAdapter from "../components/adapters/ParallelizeAdapter";
import { DataComponent } from "./Component";
import Pipeline from "./Pipeline";

export default class PipelineFactory {

    static createETLPipeline(
        extractors: DataComponent<any, any>[],
        transformers: DataComponent<any, any>[],
        loaders: DataComponent<any, any>[]) {
        return new Pipeline([
            new MergeAdapter(extractors),
            ...transformers,
            new ParallelizeAdapter(loaders)
        ]);
    }

    static createSimpleETLPipeline(
        extractor: DataComponent<any, any>,
        transformer: DataComponent<any, any>,
        loader: DataComponent<any, any>) {
        return new Pipeline([
            extractor,
            transformer,
            loader
        ]);
    }
}