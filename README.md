# Workflow
Data engineering package, to easily create data pipelines.

# Table of content

## Table of Contents

- [Getting started](#getting-started)
    - [Install the package](#install-the-package)
    - [Composition of a pipeline](#composition-of-a-pipeline)
    - [Create a pipeline](#create-a-pipeline)
    - [Run a pipeline](#run-a-pipeline)
    - [Use component adapters](#use-component-adapters)
    - [Use Pipeline Factory](#use-pipeline-factory)
    - [Industrialize a pipeline](#industrialize-a-pipeline)


## Getting started

### Install the package
```
npm install workflow-etl
```

### Composition of a pipeline

* Pipeline : The main class, used to create and start the process. A pipeline is composed of several Components.
* Components : a function or a class that does an action : extract, transform, load data...

### Create a pipeline

Example of a pipeline :
```ts
const example = Pipeline.create([
    new HttpExtractor<RawProduct>({
        url: "https://dummyjson.com/products",
        root: "products"
    }),
    (data: RawProduct[]) => data.map((d: RawProduct, i: number) => {
        return {
            id: i,
            title: d.title,
            price: d.price,
            realPrice: Math.floor(d.price * (1 - d.discountPercentage / 100)),
            rating: d.rating
        }
    }),
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
]);
```
The pipeline above fetchs data from an api, transforms it to select fields and computes a new "realPrice" field, and finally loads it into a csv file.

A pipeline is a succession of components, which exchanges data in a chain. A component must be standalone and stateless, it could be an object or a function.

This package provides several components to extract and to load data into files or databases (ie. ```HttpExtractor``` or ```CsvLoader```). It is possible to create a component with a class that extends ```Component``` or a function with this signature ```(data: []) => []```.

### Run a pipeline

A pipeline can easily be run by calling ```process()``` on the pipeline object. This function is asynchronous.

```ts
example.process().then(() => {
    console.log("Pipeline finished")
}).catch((error) => {
    console.error("Pipeline failed", error)
});
```

### Use component adapters

To build more complexe pipelines, some components called adapters help to change the flow of the pipeline. For example, the MergeAdapter helps to process several components simultaneously and merged the returning data into a single list.

Example of a MergeAdapter on the previous example :
```ts
const example = Pipeline.create([
    new MergeAdapter([
        new HttpExtractor<RawProduct>({
            url: "https://dummyjson.com/products",
            root: "products"
        }),
        new HttpExtractor<RawProduct>({
            url: "https://dummyjson.com/products",
            root: "products"
        }),
    ]),
    (data: RawProduct[]) => data.map((d: RawProduct, i: number) => {
        return {
            id: i,
            title: d.title,
            price: d.price,
            realPrice: Math.floor(d.price * (1 - d.discountPercentage / 100)),
            rating: d.rating
        }
    }),
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
]);
```
The difference here, is in the extraction of data, this pipeline will fetch data from the api twice and simultaneously, after that it will merge the two results into one.

### Use Pipeline Factory

TODO

### Industrialise a pipeline

This package provides some options to industrialise a pipeline. A pipeline can also be industrialise in a custom way.

#### Orchestrator
TODO
#### Controller
TODO