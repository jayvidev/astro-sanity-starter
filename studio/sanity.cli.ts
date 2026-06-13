/**
 * Sanity CLI Configuration
 * Learn more: https://www.sanity.io/docs/cli
 */
import {defineCliConfig} from 'sanity/cli'
import {projectId, dataset, studioHost} from './src/env'

export default defineCliConfig({
  api: {projectId, dataset},
  // `appId` is assigned by Sanity on your first `sanity deploy` — leave it out
  // here so each project gets its own.
  deployment: {
    autoUpdates: true,
  },
  studioHost,
})
