'use strict';

import { RouterModule } from '@jamilservices/sb-module-router';
const routers = RouterModule.instance();

routers.register({
    id: "page1",
    title: "SimplyBuilder - SPA Starter - Router 1"
});
routers.register({
    id: "page2",
    title: "SimplyBuilder - SPA Starter - Router 2"
});
routers.register({
    id: "page3",
    title: "SimplyBuilder - SPA Starter - Router 3"
});

routers.register({
    id: "404",
    redirect: "page1"
})

export default Object.freeze({});