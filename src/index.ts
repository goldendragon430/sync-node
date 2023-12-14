/** @format */

import express from 'express';
import App from './app';

const app = express();
const port = 8000;
const application = new App(app);
// Create an HTTP server using Express
application.init().then((result) => {
	if (result) {
		app.listen(port, () => {
			console.log(`Server started on port ${port}`);
		});
	}
});
