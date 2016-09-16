/**
 * Created by cedric on 24/05/16.
 */
function ItemDemoViewModel(params) {
    var self = this;
    self.item = params.item;
    self.user = params.user;

    self.socket = params.scocket;
    self.title = ko.computed(function () {
        return self.item.source + ' - ' + self.item.text;
    });

    self.affect = function () {
        var sendData = {
            _id: self.item._id,
            user: ko.toJS(self.user)
        };
        params.affect(sendData);
    };
    self.unAffect = function (data) {
        params.unAffect(self.item._id, data.id);
    }
}
//demo item
ko.components.register('item-demo', {
    viewModel: ItemDemoViewModel,
    template: '<h2>' +
    '<span class="content__content-title" data-bind="text : title"></span>' +
    '</h2>' +
    '<div class="content__form-group">' +
    '<textarea class="form-control" rows="4" placeholder="Entrer la description" data-bind="value : item.description"></textarea>' +
    '</div>' +
   
    '<button class="middle-size" type="button" data-bind="click : affect">' +
        '<i class="material-icons">person_add</i> S\'affecter' +
    '</button>' +
    '<div class="user-affected-list" data-bind="foreach: item.affected">' +
            '<div class="user">' +            
                '<img class="user-img" data-bind="attr : { src: photo }" />' +
                '<label class="user-name" data-bind="text : name" ></label>' +            
            '<button type="button" data-bind="click : $parent.unAffect">' +
                '<i class="material-icons">remove_circle_outline</i>' +
            '</button>' +
            '</div>' +       
    '</div>'
});

function UserInfo(params) {
    var self = this;
    self.user = params.user();

    self.disconnect = function () {
        params.callback();
    }
}
//user login view
ko.components.register('user-connect', {
    viewModel: UserInfo,
    template: '<div class="user-top">' +
    '<img class="user-img" data-bind="attr : { src: user.photo }" />' +
    '<label class="user-name" data-bind="text : user.name" />' +
    '<button type="button" class="material-icons" data-bind="click : disconnect">exit_to_app</button>' +
    '</div>'
});

function MenuModel() {
    var self = this;
    //on maintient le status du menu
    self.status = ko.observable(false);
    //si on suppose que les pages sont dynamiques
    self.items = [
        {title: 'Accueil', anchor: '/home'},
        {title: 'Création', anchor: '/create'},
        {title: 'Utilisateurs', anchor: '/users'},
        {title: 'Résumé', anchor: '/print'},
        {title: 'Archives', anchor: '/archive'}
    ];
    self.show = function () {
        self.status(true)
    };
    self.close = function () {
        self.status(false);
    };

    //retourne la classe associée a l'état du menu (ouvert ou fermé)
    self.visibleSideNav = ko.computed(function () {
        return self.status() ? 'opened' : '';
    });

    //accède à la section
    self.goTo = function (item) {
        window.location = item.anchor;
        self.close();
    }

}

ko.components.register('side-nav', {
    viewModel: MenuModel,
    template: '<div class="menu-title">' +
    '<button data-bind="click : show" ><i class="material-icons">menu</i></button>' +
    '</div>' +
    '<div class="menu" data-bind="css : visibleSideNav">' +
    '<header class="menu-header">' +
    '<button class="close-menu" data-bind="click : close"><i class="material-icons">close</i></button>' +
    'Menu' +
    '</header>' +
    '<div class="menu-links" data-bind="foreach : items">' +
    '<nav data-bind="click: $parent.goTo, text : title"></nav>' +
    '</div>' +
    '</div>'
});

ko.components.register('readonly-item', {
    viewModel: function (params) {
        var self = this;
        self.item = params.item;

        self.title = ko.computed(function () {
            return self.item.source() + ' - ' + self.item.text();
        });
    },
    template: '<h2>' +
    '<span class="content__content-title" data-bind="text : title"></span>' +
    '</h2>' +
    '<div class="content__form-group">' +
    '<div class="form-control" data-bind="html : item.markdown"></div>' +
    '<div class="user-affected-list" data-bind="foreach: item.affected">' +
    '<div class="user">' +
    '<img class="user-img" data-bind="attr : { src: photo }" />' +
    '<label class="user-name" data-bind="text : name" ></label>' +
    '</div>' +
    '</div>'

});