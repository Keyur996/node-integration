import App from './app';
import ZoomRoute from '@routes/zoom/index.route';

const app = new App([new ZoomRoute()]);

app.listen();
