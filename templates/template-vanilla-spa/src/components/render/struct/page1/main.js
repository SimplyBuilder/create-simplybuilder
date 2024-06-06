'use strict';

const main = {
    element: "article",
    children: [
        {
            element: "h2",
            text: "SimplyBuilder Router - page 1"
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

export const page1Struct = Object.freeze(struct);