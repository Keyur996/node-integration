import App from './app';
import ZoomRoute from '@routes/zoom/zoom.route';

const app = new App([new ZoomRoute()]);

app.listen();
