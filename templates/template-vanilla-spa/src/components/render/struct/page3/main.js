'use strict';

const main = {
    element: "article",
    children: [
        {
            element: "h2",
            text: "SimplyBuilder Router - page 3"
        }
    ]
};

const struct = {
    element: "section",
    dataset: {
        state: "view.main"
    },
    children: [main]
};

export const page3Struct = Object.freeze(struct);