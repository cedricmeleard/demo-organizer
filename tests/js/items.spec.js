define(['app/js/items', 'socket.io'], function (Items, io) {

    describe('manage item list main', function () {

        it('prepareItem test', function () {
            new Items(io).prepareItem(item);
            expect(item.position).toEqual(0);
        });
    });
});