# Lorenzi's Jisho

Lorenzi's Jisho is a web frontend for the [JMdict](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project) Japanese-English dictionary project!
It supports creating and sharing custom study lists with your searched words,
and you can export them in an [Anki](https://apps.ankiweb.net/)-compatible format.

It is live at https://jisho.hlorenzi.com

[![Discord][badge-discord-img]][badge-discord-url]

[badge-discord-img]: https://img.shields.io/discord/394999035540275222?label=Join%20the%20Discord%20server!&logo=discord
[badge-discord-url]: https://accounts.hlorenzi.com/redirect/discord

## License

I haven't chosen how to license this repository's code yet. Please only use it for personal reference.

## Local Development

To start:
* Use `node` version 16 (or greater).
* In all of `common/`, `backend/`, and `frontend/`, execute `npm install`.
* If you have MongoDB installed, in `backend/`, execute `npm run db-build` to download JMdict and build the database.

To work on the codebase, execute in parallel:
* In `backend/`, execute `npm run dev` to start the server in watch mode. You can pass arguments to select between a few options for internal services. Remember to pass as `npm run dev -- --option`.
  * For the database service:
    * `--db-mongo` Use MongoDB. This is the default.
    * `--db-dummy` Use a dummy interface that returns empty results.
  * For the authentication service:
    * `--auth-dummy` Use a dummy service which lets you log in with any user ID. This is the default.
    * `--auth-lorenzi`, `--auth-lorenzi-dev` Use Lorenzi's closed-source auth server. You probably won't have access to it, so use the dummy service.

* In `frontend/`, execute `npm run dev` to build and pack the frontend JavaScript files in watch mode.

* Finally, you can access the page through `http://127.0.0.1`.