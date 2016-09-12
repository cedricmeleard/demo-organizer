# demo-organizer

## Description

A little app helping team to organize a preview.
Each dev can connect using google account, then affects a item to him, and at last add a description of what he is going
to show

Items can be reorganized dynamically.

## Install

this project depends on nodejs, it use express, socket.io and passport (google auth)
it also depends on ruby and particularly no sass (here it's scss) for css compile.

therefore you'll need to install nodejs : [Nodejs](https://nodejs.org/en/)
a mongodb instance running : [MongoDb](https://www.mongodb.com/)
ruby : [ruby](https://www.ruby-lang.org/fr/)
and sass : [Sass](http://sass-lang.com/install)

## Start

Once everything is set up, you can use package.json to configure project
run

    npm install

then

    npm start

## Use

You need to connect using google account, then there is 2 pages you can access.
by default server start listening on port 81 (see index.js)
then my google code config is set for a callback url on localhost:81 to, those things needs to be changed with
your own values in app/js/config.js

### http://localhost:81/home
root access, where you can see item and modify them

### http://localhost:81/create
allow a user to add a new item

### http://localhost:81/print
allow an unauthenticated user to see what's going on

### http://localhost:81/users
display actually connected users

## What's next?

App is in her first stage developpment, many things are still todos and other need refactoring.
Let's see what is in backlog:

- Save an organization in database, load a previous organization, screen management for this
- Refactor authentication, using multiple services such as facebook ou twitter
- Add a printable version screen
- Add a navigation menu to switch between screen (edit/create/view/manage/history)
- Add a disconnect function
- Allow use of text markeup in description
- Allow mutliple user affected on 1 item, set one of them as lead (will make presentation)
- Allow grouping/ungrouping tickets (many little tickets for functionnality presentation in a row)
- Better design
- Particpant list
- chatroom for participants
