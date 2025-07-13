# BankToYnab

This project serves as a playground for experimenting with the Gemini CLI.

It converts CSV files from Delavska Hranilnica and NLB banks into a format compatible with YNAB (You Need A Budget).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## Running with Docker Compose

To run the application using Docker Compose, navigate to the project root directory and execute:

```bash
docker-compose up
```

This will build the Docker image (if not already built) and start the container. The application will be accessible at [http://localhost:3000](http://localhost:3000).