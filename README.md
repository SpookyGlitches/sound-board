# SoundBoard 🔊

Find, categorize, and play sound clips.

## Motivation

I like voice lines and I've been into this Hololive rabbit hole recently. Their VTubers create a lot of interesting noises. You can try visiting one here for [Rushia](https://rushia.moe/#/) and [Pekora](https://peko.top/).

That's 2 websites to visit and I don't want that. I also want it to be dynamic and more general like a game hero's voice lines, sound effects, a podcast moment, and such.

## Installation

1. Clone the repository

      ```
      git clone https://github.com/SpookyGlitches/sound-board.git
      ```

2. Install packages
      ```
      npm install
      ```
3. Rename .env.example to .env and supply it with details
4. Create the database using sequelize-cli
      ```
      npx sequelize-cli db:create
      ```
5. Run the migrations
      ```
      npx sequelize-cli db:migrate
      ```
6. Run the program
      ```
      node app
      ```

Still has some work to doooo.

