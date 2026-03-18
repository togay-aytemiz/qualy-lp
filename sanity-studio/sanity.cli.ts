import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'n55lf918',
    dataset: 'production'
  },
  studioHost: 'qualy-n55lf918',
  deployment: {
    appId: 'ot1ps6g2osnr1rwap82yx8zg',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
