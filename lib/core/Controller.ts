import Pipeline from "./Pipeline";
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

    static init(login: string, password: string): Express {
        this.app.use('/api', this.router);

        // Basic auth
        this.app.use((req, res, next) => {
            const auth = { login, password }
            const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
            const [log, pwd] = Buffer.from(b64auth, 'base64').toString().split(':')
            if (log && pwd && log === auth.login && pwd === auth.password) {
                return next()
            }
            res.sendStatus(401);
        })

        this.app.get('/', (req: any, res: any) => {
            res.send(this.routes);
        });
        return this.app;
    }

    static start(port: number = 3000): Express {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
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

    public static addRoute(route: string, handler: (res: any, req: any) => void, method: string = "get") {
        switch (method) {
            case "get":
                this.app.get(route, handler);
                break;
            case "post":
                this.app.post(route, handler);
                break;
            case "put":
                this.app.put(route, handler);
                break;
            case "delete":
                this.app.delete(route, handler);
                break;
        }

        this.routes.push({
            name: `${method} ${route}`,
            uri: route
        });
    }
}