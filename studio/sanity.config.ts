import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {projectId, dataset} from './src/env'

export default defineConfig({
  name: 'default',
  title: 'Sanity Starter',
  projectId,
  dataset,
  plugins: [structureTool({structure}), visionTool(), media()],
  schema: {types: schemaTypes},
})
