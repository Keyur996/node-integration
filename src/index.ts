import App from './app';
import ZoomRoute from '@routes/zoom/index.route';
import AuthRoute from '@routes/auth/index.route';

const app = new App([new AuthRoute(), new ZoomRoute()]);

app.listen();
