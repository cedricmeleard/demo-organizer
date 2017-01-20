//VueJS components

//navigation element
Vue.component('side-nav', {
    data: function () {
        return {
            items: [
                {title: 'Accueil', anchor: '/home'},
                {title: 'Création', anchor: '/create'},
                {title: 'Utilisateurs', anchor: '/users'},
                {title: 'Résumé', anchor: '/print'},
                {title: 'Archives', anchor: '/archive'}
            ],
            status: false
        };
    },
    methods: {
        toggle: function () {
            //toggle status
            this.status = !this.status;
        },
        goTo: function (item) {
            this.status = false;
            window.location = item.anchor;
        }
    },
    template: `<div class="side-nav" :class="{ 'open' : status }"><div class="menu-title">
    <button @click="toggle"><i class="material-icons">menu</i></button>
    </div>
    <div class="menu" :class="{ 'opened' : status }">
    <header class="menu-header">
    <button class="close-menu" @click="toggle"><i class="material-icons">close</i></button>
    Menu
    </header>
    <div class="menu-links" v-for="item in items">
    <nav @click="goTo(item)">{{ item.title }}</nav>
    </div>
    </div>
    </div>`
});

//user login view
Vue.component('user-connect', {
    props: {
        socket: {
            type: Object,
            required: true
        }
    },
    data: function () {
        return {
            socketStarted: false
        }
    },
    computed: {
        user: function () {
            let user = JSON.parse($("#usrInfo").val());
            if (this.socket && !this.socketStarted) {
                this.socket.emit('user connected', user);
                this.socketStarted = true;
            }
            return user;
        }
    },
    methods: {
        disconnect: function () {
            window.location = '/login#';
        }
    },
    template: `<div class="user-top">
    <img class="user-img" :src="user.photo" />
    <label class="user-name">{{ user.name }}</label>
    <button type="button" class="material-icons" @click="disconnect">exit_to_app</button>
    </div>`
});

//readonly item
Vue.component('readonly-item', {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    computed: {
        title: function () {
            return this.item.source + ' - ' + this.item.text
        }
    },
    template: `<div class="content read-only">
    <h2>
    <span class="content__content-title">{{ title }}</span>
    </h2>
    <div class="content__form-group">
    <div class="form-control" v-html="item.markdown"></div>
    <div class="user-affected-list" v-for="affected in item.affected">
    <div class="user">
    <img class="user-img" v-bind:src="affected.photo" />
    <label class="user-name">{{ affected.name }}</label>
    </div>
    </div>
    </div>`
});

Vue.component('edit-item', {
    props: ['item', 'socket', 'max'],
    methods: {
        moveUp: function () {
            if (this.item.position == 0) return;
            let move = {from: this.item.position, to: this.item.position - 1};
            this.socket.emit('item positioned', move);
        },
        moveDown: function () {
            if (this.item.position == this.max) return;
            let move = {from: this.item.position, to: this.item.position + 1};
            this.socket.emit('item positioned', move);
        },
        remove: function () {
            this.socket.emit('item deleted', this.item._id);
        }
    },
    template: `
<div class="item">
    <div class="actions">
        <button type="button" @click="moveUp"><i class="material-icons">keyboard_arrow_up</i></button>
        <button type="button" @click="moveDown"><i class="material-icons">keyboard_arrow_down</i></button>
    </div>
    <item-demo :item="item" :socket="socket"></item-demo>
    <div class="actions">
        <button type="button" @click="remove"><i class="material-icons">delete</i></button>
    </div>
</div>`
});

//demo item
Vue.component('item-demo', {
    props: ['item', 'socket'],
    computed: {
        title: function () {
            return this.item.source + ' - ' + this.item.text;
        },
        user: function () {
            return JSON.parse($("#usrInfo").val());
        },
        showadd: function () {
            if (!this.item.affected.length) return true;

            let tmp = this.user;
            return !this.item.affected.find(function (element) {
                return tmp.id === element.id;
            });
        }
    },
    methods: {
        affect: function () {
            let sendData = {_id: this.item._id, user: this.user};
            this.socket.emit('item affected', sendData);
        },
        unAffect: function (userId) {
            this.socket.emit('item unaffected', this.item._id, userId);
        },
        update: function (value) {
            this.item.description = value;
            this.socket.emit('item updated', this.item);
        }
    },
    template: `
<div class="content">
    <h2><span class="content__content-title">{{ title }}</span></h2>
    <div class="content__form-group">
        <textarea class="form-control" rows="4" placeholder="Entrer la description" 
        v-bind:value="item.description" v-on:input="update($event.target.value)"></textarea>
    </div>
    <transition name="fade">
        <button v-if="showadd" class="middle-size" type="button" @click="affect"><i class="material-icons">person_add</i>S'affecter</button>
    </transition>
    <div class="user-affected-list" v-for="myAffected in item.affected">
        <transition name="fade">
            <div class="user">
                <img class="user-img" :src="myAffected.photo" />
                <label class="user-name">{{myAffected.name}}</label>
                <button type="button" @click="unAffect(myAffected.id)"><i class="material-icons">remove_circle_outline</i></button>
            </div>
        </transition>
    </div>
</div>`
});

//user line
Vue.component('user-item', {
    props: ['user'],
    template: `<div class="user">
        <img class="user-img" :src="user.photo" />
        <label class="user-name">{{ user.name }}</label>
    </div>`
});