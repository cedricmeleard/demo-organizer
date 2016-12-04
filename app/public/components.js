/**
 * Created by cedric on 24/05/16.
 */
class ItemDemoViewModel {
    constructor(params) {
        //data
        this.item = params.item;
        this.user = params.user;
        this.socket = params.scocket;
        //computed
        this.title = ko.computed(() => {
            return this.item.source + ' - ' + this.item.text
        });
        //functions
        this.affect = () => {
            let sendData = {_id: this.item._id, user: ko.toJS(this.user)};
            params.affect(sendData);
        };
        this.unAffect = (data) => {
            params.unAffect(this.item._id, data.id);
        };
    }
}
//demo item
ko.components.register('item-demo', {
    viewModel: ItemDemoViewModel,
    template: `<h2><span class="content__content-title" data-bind="text : title"></span></h2>
    <div class="content__form-group">
    <textarea class="form-control" rows="4" placeholder="Entrer la description" data-bind="value : item.description"></textarea>
    </div>

    <button class="middle-size" type="button" data-bind="click : affect">
    <i class="material-icons">person_add</i>S\'affecter
    </button>
    <div class="user-affected-list" data-bind="foreach: item.affected">
    <div class="user">
    <img class="user-img" data-bind="attr : { src: photo }" />
    <label class="user-name" data-bind="text : name" ></label>
    <button type="button" data-bind="click : $parent.unAffect">
    <i class="material-icons">remove_circle_outline</i>
    </button>
    </div>
    </div>`
});

class UserInfo {
    constructor(params) {
        this.user = params.user();
        this.disconnect = () => {
            params.callback();
        }
    }
}
//user login view
ko.components.register('user-connect', {
    viewModel: UserInfo,
    template: `<div class="user-top">
    <img class="user-img" data-bind="attr : { src: user.photo }" />
    <label class="user-name" data-bind="text : user.name" />
    <button type="button" class="material-icons" data-bind="click : disconnect">exit_to_app</button>
    </div>`
});

class MenuModel {
    constructor() {
        //datas
        this.status = ko.observable(false);
        //si on suppose que les pages sont dynamiques
        this.items = [
            {title: 'Accueil', anchor: '/home'},
            {title: 'Création', anchor: '/create'},
            {title: 'Utilisateurs', anchor: '/users'},
            {title: 'Résumé', anchor: '/print'},
            {title: 'Archives', anchor: '/archive'}
        ];
        //computed
        this.visibleSideNav = ko.computed(() => {
            return this.status() ? 'opened' : '';
        });

        //functions
        this.show = () => {
            document.querySelector('side-nav').classList.toggle('open');
            this.status(true)
        };
        this.close = () => {
            document.querySelector('side-nav').classList.toggle('open');
            this.status(false);
        };
        //accède à la section
        this.goTo = (item) => {
            window.location = item.anchor;
            this.close();
        }
    }
}
ko.components.register('side-nav', {
    viewModel: MenuModel,
    template: `<div class="menu-title">
    <button data-bind="click : show" ><i class="material-icons">menu</i></button>
    </div>
    <div class="menu" data-bind="css : visibleSideNav">
    <header class="menu-header">
    <button class="close-menu" data-bind="click : close"><i class="material-icons">close</i></button>
    Menu
    </header>
    <div class="menu-links" data-bind="foreach : items">
    <nav data-bind="click: $parent.goTo, text : title"></nav>
    </div>
    </div>`
});

//TODO a revoir on devrait avoir un héritage entre cette class et ItemDemoViewModel
class ItemDemoViewModelReadOnly {
    constructor(params) {
        this.item = params.item;
        this.title = ko.computed(() => {
            return this.item.source() + ' - ' + this.item.text();
        });
    }
}
ko.components.register('readonly-item', {
    viewModel: ItemDemoViewModelReadOnly,
    template: `<h2>
    <span class="content__content-title" data-bind="text : title"></span>
    </h2>
    <div class="content__form-group">
    <div class="form-control" data-bind="html : item.markdown"></div>
    <div class="user-affected-list" data-bind="foreach: item.affected">
    <div class="user">
    <img class="user-img" data-bind="attr : { src: photo }" />
    <label class="user-name" data-bind="text : name" ></label>
    </div>
    </div>`

});