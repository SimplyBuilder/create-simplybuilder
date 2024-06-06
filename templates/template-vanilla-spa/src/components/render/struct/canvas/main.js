'use strict';

const menuItems = [
    {text: "router 1", link: "page1"},
    {text: "router 2", link: "page2"},
    {text: "router 3", link: "page3"}
];

const menuItemsStruct = () => {
    const struct = [];
    for (let i = (menuItems.length - 1); i >= 0; i--) {
        const item = menuItems[i];
        if (item) {
            const {text, link} = item;
            if (text && link) {
                const itemSchema = {
                    element: "a",
                    attr: {
                        href: "./#/" + link
                    },
                    text
                };
                const schema = {
                    element: "li",
                    attr: {
                        class: "item-menu link"
                    },
                    children: [itemSchema]
                };
                struct.push(schema);
            }
        }
        if (i === 0) return struct.toReversed();
    }
};

const navStruct = {
    element: "nav",
    children: [
        {
            element: "ul",
            children: menuItemsStruct()
        }
    ]
};

const headerStruct = {
    element: "header",
    children: [
        navStruct
    ]
};

const contentStruct = {
    element: "main",
    dataset: {
        state: "main.canvas"
    }
};
const footerStruct = {
    element: "footer",
    text: "created by SimplyBuilder"
};
const struct = {
    element: "section",
    attr: {
        class: "canvas-container"
    },
    children: [
        headerStruct,
        contentStruct,
        footerStruct
    ]
};

export const canvasStruct = Object.freeze(struct);