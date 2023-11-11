# Lorenzi's Jisho Open

## Local Development

To start:
* Use `node` version 16 (or greater).
* In both `backend/` and `frontend/`, execute `npm install`.
* If you have MongoDB installed, in `backend/`, execute `npm run db-build` to download JMdict and build the database.

To work on the codebase, execute in parallel:
* In `backend/`, execute `npm run dev` to start the server in watch mode. You can pass arguments to select between a few options for internal services. Remember to pass as `npm run dev -- --option`.
  * For the database service:
    * `--db-mongo` Use MongoDB. This is the default.
    * `--db-dummy` Use a dummy interface.
  * For the authentication service:
    * `--auth-lorenzi` Use Lorenzi's closed-source auth server. This is the default. You probably won't have access to it, so use the dummy service.
    * `--auth-dummy` Use a dummy service which lets you log in with any user ID.

* In `frontend/`, execute `npm run dev` to build and pack the frontend JavaScript files in watch mode.

* Finally, you can access the page through `http://127.0.0.1`.