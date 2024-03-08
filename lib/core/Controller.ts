import Pipeline from "./pipeline/Pipeline";
import express from 'express';
import { Express } from 'express';

export default class Controller {

    constructor(
        private pipeline: Pipeline,
        private name: string,
    ) { }

    private static app = express();
    private static router = express.Router();
    private static routes: any[] = [];

    static start(port: number = 3000): Express {
        this.app.use('/api', this.router);
        this.app.listen(port, () => {
            console.log('Server is running on port 3000');
        });
        this.app.get('/', (req: any, res: any) => {
            res.send(this.routes);
        });
        return this.app;
    }

    public enableApi() {
        Controller.routes.push({
            name: this.name,
            uri: "/job/" + this.name
        });
        Controller.app.get('/job/' + this.name, (req: any, res: any) => {
            console.log(this.name + ' started');
            this.pipeline.process()
                .then(() => {
                    console.log(this.name + ' finished');
                }
                ).catch((error) => {
                    console.error(this.name + ' failed', error);
                });
            return res.send(this.name + ' started');
        });
    }
}