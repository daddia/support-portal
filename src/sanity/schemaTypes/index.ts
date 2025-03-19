import { type SchemaTypeDefinition } from 'sanity'
import knowledgeBase from './knowledgeBase'
import category from './category'
import author from './author'
import code from './code'
import frontPage from './frontPage'

export const schemaTypes = [knowledgeBase, category, author, code, frontPage]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
