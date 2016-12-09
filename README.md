# demo-organizer

## Description

A little app helping team to organize a preview.
Each user can connect using his google account.

Then you can create sprint item and organize them quickly.
Once you demo is over you can archive a entire sprint and start a new one.

## Install

this project depends on nodejs, it use express, socket.io and passport (google auth)
it also depends on ruby and particularly no sass (here it's scss) for css compile.

therefore you'll need to install nodejs : [Nodejs](https://nodejs.org/en/)
a mongodb instance running : [MongoDb](https://www.mongodb.com/)
ruby : [ruby](https://www.ruby-lang.org/fr/)
and sass : [Sass](http://sass-lang.com/install)

## Start

Once everything is set up, you can use package.json or gulpfile
so, run:

    npm install

then

    gulp

## Use

You need to connect using google account, if you do not want to connect you'll should see current
demo preparing.

by default server start listening on port 5000 (see index.js and config.js)
then my google code config is set for a callback url on localhost:5000/oauth2callback too,
 
those things needs to be changed with your own values in app/js/config.js


## What's next?

App is in her first stage developpment, many things are still todos and other need refactoring.
Let's see what is in backlog:

- Refactor authentication, using multiple services such as facebook ou twitter
- Add a disconnect function
- Allow grouping/ungrouping tickets (many little tickets for functionnality presentation in a row)
- Better design
- chatroom for participants

## what's new?

> Release 1.0.0 - major 1 

changing from knockout to vuejs
adding gulpfile

> before 1.0.0

Manage items