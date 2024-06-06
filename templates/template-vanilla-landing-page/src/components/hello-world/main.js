'use strict';

const mainText = {
    "element": "h2",
    "text": "Hello, World!"
};

const helloWordExample = (CoreModule) => {
  return [
      mainText,
      {
          "element": "h4",
          "text": "by SimplyBuilder "+ CoreModule.version
      }
  ]
};

export default Object.freeze(helloWordExample);