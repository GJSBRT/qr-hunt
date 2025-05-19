# Playmix
Playmix is an web app where people can play different types of games together.

## Requirements
Requirements other than the normal Laravel 11 requirements.
- php8.3-imagick
- [Soketi](https://docs.soketi.app/)

## Development
### Game modes
Game modes can be seen as plugins. To prevent different game modes from effecting each other a sort of framework has been created.

#### Backend
For the backend Php with the Laravel framework is used. Game modes are in a specific namespace to prevent clashing with other Laravel stuff. Please also prefix classes with the game mode's name.

##### Structure
Game modes are stored in `app/GameModes`. Each game mode has it's own directory.

###### Root directory
In the root directory of a game mode, game logic can be stored. There must be a class with the game mode's name extending the `GameMode` class.

###### Commands
Extra game mode specific commands can be stored here. These are standard Laravel commands and are automaticaly read by artisan.

###### Events
Extra game mode specific events can be stored here. These are standard Laravel events.

There are a few channels which can be used.
- `game.{gameId}`. For events meant for anyone in the game.
- `team.{teamId}`. For events meant for a specific team.
- `team-player.{teamPlayerId}`. For events meant for a specific team player.

###### migrations
Each game mode can modify the database using standard Laravel migrations which are stored in this directory. These migrations are meant to create extra tables used for storing data about the game mode like game state.

###### Models
In this directory game mode specific models can be stored here. These are standard Laravel models.

#### Frontend
For the frontend Typescript, React and Ionic framework are used. As convention, React component file names are formated with PascalCase and regular Typescript file names are formatted with snake_case.

##### Structure
Game modes are stored in `resources/js/GameModes`. Like the backend, each game mode has it's own directory. Unlike the backend, game modes must be defined in `resources/js/GameModes/gamemodes.ts`. A specific structure is not required here as javascript does not use namespaces, however to keep things constitant the following structure is used.

###### Root directory
The root directory contains files extending the Game classes.

###### game_master
In this directory the `GameMaster` class is extended in a `index.tsx` file. To keep files under a million lines, pages here can be split into different files as React components and imported into the main extended class. 

###### types
As we're using Typescript, types need to be stored somewhere and that is here.

### Framework
As this project has become as sort of framework for game modes, additional documentation can be noted here.
