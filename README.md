# Quantum Dashboard
====================
## Description
Quantum Dashboard is a React application that provides a user interface for displaying dashboard data and logs from a backend API. The application utilizes a custom API client to interact with the backend API, encapsulating the logic for making API requests and processing responses.

## Features
* Displays dashboard data, including results, quantum walk, and QFT data
* Fetches and displays logs from the backend API
* Utilizes a custom API client for interacting with the backend API

## Tech Stack
* React
* Vite
* TypeScript
* Fetch API

## Installation
To install the project, run the following command:
```bash
npm install
```
## Usage
To start the development server, run the following command:
```bash
npm run dev
```
To build the application, run the following command:
```bash
npm run build
```
Note: The `vite.config.ts` file contains the configuration for the Vite development server and build process. The `src/api.ts` file provides the API client for interacting with the backend API.

### API Documentation
The API client is defined in `src/api.ts` and provides the following functions:
* `getDashboard`: makes multiple API requests to fetch dashboard data
* `getLogs`: makes an API request to fetch logs

### Environment Variables
The application uses the following environment variable:
* `VITE_API_BASE_URL`: the base URL of the backend API

Please ensure that this environment variable is set before running the application.