# Lorenzi's Jisho Open

## Local Development

To start:
* Have MongoDB installed. You can swap the DB interface for a dummy one to skip this step, but this currently needs to be done manually in the code.
* In both `backend/` and `frontend/`, execute `npm install`.
* In `backend/`, execute `npm run db-build` to download JMdict and build the database.

To work on the codebase, execute in parallel:
* In `frontend/`, execute `npm run build-dev` to build and pack the frontend JavaScript files in watch mode.
* In `backend/`, execute `npm run serve-dev` to start the server in watch mode.
* Finally, you can access the page through `http://127.0.0.1`.