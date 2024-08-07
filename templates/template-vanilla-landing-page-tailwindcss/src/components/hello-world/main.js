'use strict';

const mainText = {
    "element": "h2",
    "attr": {
        "class": "text-4xl"
    },
    "text": "Hello, World!"
};

const helloWordExample = (CoreModule) => {
    return [
        mainText,
        {
            "element": "h4",
            "attr": {
                "class": "text-xl"
            },
            "text": "by SimplyBuilder "+ CoreModule.version
        }
    ]
};

export default Object.freeze(helloWordExample);