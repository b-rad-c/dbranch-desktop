module.exports = {
    packagerConfig: {
        appCopyright: 'Copyright 2022 Brad Corlett',
        icon: './assets/desktop-icon'
    },
    makers: [
        {
            name: '@electron-forge/maker-zip'
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                background: './assets/dmg-background.png',
                icon: './assets/desktop-icon.icns'
            }
          }
    ]
}