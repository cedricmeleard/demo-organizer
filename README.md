# demo-organizer

## Description

A little app helping team to organize a preview.
Each dev can connect using google account, then affects a item to him, and at least add a dsecription of what he is going
to show

Items can be reorganized dynamically.

## install

this project depends on nodejs, it use express, socket.io and passport (google auth)
it also depends on ruby and particularly no sass (here it's scss) for css compile.

therefore you'll to install nodejs : [Nodejs](https://nodejs.org/en/)

ruby : [ruby](https://www.ruby-lang.org/fr/)

and sass : [Sass](http://sass-lang.com/install)


## start

Once everything is set up
run

    npm install

then

    npm start

## Use

You need to connect using google account, then there is 2 pages you can access.
by default server start listening on port 81

### /
root access, where you can see item and modify them

### /create
allow a user to add a new item
