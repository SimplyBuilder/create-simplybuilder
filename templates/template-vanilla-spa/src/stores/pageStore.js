'use strict';

import { NotifyModule } from '@jamilservices/sb-module-notify';
const storeEvents = NotifyModule.instance("page-store");
const routerWacth = NotifyModule.instance("router");

const store = {
    page: undefined,
    render: 'main'
};

const routerEvents = (data = {}) => {
    try {
        const {event, target} = data;
        if (event === "router-update" && target) {
            if(store.render === 'main') store.render = "section";
            if(store.page !== target) {
                store.page = target;
                storeEvents.emit({
                    origin: 'page-store', render: data.target
                });
            }
        }
    } catch (e) {
        console.error(e);
    }
}

routerWacth.subscribe({
    id: "store-watch",
    fn: routerEvents
});

export default Object.freeze({});