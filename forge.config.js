module.exports = {
    packagerConfig: {
        "appCopyright": "Copyright 2022 Brad Corlett",
        "icon": "./assets/desktop-icon",
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "dbranch_website"
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: [
                "darwin"
            ]
        },
        {
            name: "@electron-forge/maker-deb",
            config: {}
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {}
        }
    ]
}