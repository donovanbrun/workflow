import { Controller, CsvLoader, HttpExtractor, JsonLoader, log, MergeAdapter, Orchestrator, ParallelizeAdapter, Pipeline, PipelineFactory } from "workflow-etl";

// Define types
type RawProduct = {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
};

type Product = {
    id: number;
    title: string;
    price: number;
    realPrice: number;
    rating: number;
};

// Define extractors, transformers and loaders
const extractors = [
    new MergeAdapter([
        new HttpExtractor<RawProduct>({
            url: "https://dummyjson.com/products",
            root: "products",
            headers: {}
        }),
        new HttpExtractor<RawProduct>({
            url: "https://dummyjson.com/products",
            root: "products",
            headers: {}
        }),
    ])
];

const transformers = [
    (data: RawProduct[]) => data.map((d: RawProduct, i: number) => {
        return {
            id: i,
            title: d.title,
            price: d.price,
            realPrice: Math.floor(d.price * (1 - d.discountPercentage / 100)),
            rating: d.rating
        }
    }),
]

const loaders = [
    new ParallelizeAdapter([
        new CsvLoader<Product>({
            path: "data/customers.csv",
            columns: [
                "id",
                "title",
                "price",
                "realPrice",
                "rating"
            ]
        }),
        new JsonLoader<Product>({
            path: "data/customers.json"
        }),
    ])
]

// Create pipeline
const pipeline = Pipeline.create([
    ...extractors,
    ...transformers,
    ...loaders,
])

// Run pipeline
pipeline.process().then(() => {
    console.log("Pipeline finished")
}).catch((error) => {
    console.error("Pipeline failed", error)
});

// Create orchestrator
const orchestrator = new Orchestrator("example", "Example orchestrator", pipeline, "0 0 0 0");
//orchestrator.schedule();

// Create Controller
const controller = new Controller(pipeline, "example");
controller.enableApi();
Controller.start(3000);