module.exports = {
    packagerConfig: {
        appCopyright: 'Copyright 2022 Brad Corlett',
        icon: './assets/desktop-icon'
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                authors: 'Brad Corlett',
                description: 'The dBranch desktop application'
            }
        },
        {
            name: '@electron-forge/maker-zip'
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                background: './assets/dmg-background.png',
                icon: './assets/desktop-icon.icns' // icon for the title bar of the dmg finder window
            }
        }
    ]
}