module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "_": true,
        "jQuery": true,
        "$": true
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": 0
    }
};
