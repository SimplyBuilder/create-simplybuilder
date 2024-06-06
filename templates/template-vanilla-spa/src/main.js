'use strict';

import {CoreModule} from "@jamilservices/sb-core-module";
import "@styles/main.scss";
import helloWordExample from "@components/hello-world/main.js";

document.addEventListener("DOMContentLoaded", () => {
    if(CoreModule && CoreModule.version.split(".")[0] >= 1) {
        const SimplyBuilderContainerStruct = {
            "element": "section",
            "attr": {
                "class": "view-container"
            },
            "dataset": {
                "state": "simply-builder.main"
            },
            "children": [
                ...helloWordExample(CoreModule)
            ]
        };
        CoreModule.createFromStruct({
            struct: SimplyBuilderContainerStruct
        });
    }
});
