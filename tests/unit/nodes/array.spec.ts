/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Compiler } from '../../../src/compiler/main.js'
import { validateCode } from '../../../factories/code_validator.js'
import { getClosingOutput, getInitialOutput } from '../../../factories/output.js'

test.group('Array node', () => {
  test('create JS output for array node', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        each: {
          type: 'literal',
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          bail: false,
          validations: [],
        },
      },
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: '',`,
      `  wildCardPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item);`,
      `if (ensureIsArray(root_item)) {`,
      `if (root_item.isValid) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isValid) {`,
      `const root_item_out = [];`,
      `out = root_item_out;`,
      `const root_item_items_size = root_item.value.length;`,
      `for (let root_item_i = 0; root_item_i < root_item_items_size; root_item_i++) {`,
      `const root_item_item = defineValue(root_item.value[root_item_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: root_item_i,`,
      `  wildCardPath: '*',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(root_item_item);`,
      `if (root_item_item.isDefined && root_item_item.isValid) {`,
      `  root_item_out[root_item_i] = root_item_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for nullable array node', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        each: {
          type: 'literal',
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          bail: false,
          validations: [],
        },
      },
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: '',`,
      `  wildCardPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsArray(root_item)) {`,
      `if (root_item.isValid) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isValid) {`,
      `const root_item_out = [];`,
      `out = root_item_out;`,
      `const root_item_items_size = root_item.value.length;`,
      `for (let root_item_i = 0; root_item_i < root_item_items_size; root_item_i++) {`,
      `const root_item_item = defineValue(root_item.value[root_item_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: root_item_i,`,
      `  wildCardPath: '*',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(root_item_item);`,
      `if (root_item_item.isDefined && root_item_item.isValid) {`,
      `  root_item_out[root_item_i] = root_item_item.value;`,
      `}`,
      `}`,
      `}`,
      `} else if (root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output without array validations', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        validations: [],
        each: {
          type: 'literal',
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          bail: false,
          validations: [],
        },
      },
    })

    const compiledOutput = compiler.compile().toString()

    validateCode(compiledOutput)
    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: '',`,
      `  wildCardPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsArray(root_item)) {`,
      `if (root_item.isValid) {`,
      `const root_item_out = [];`,
      `out = root_item_out;`,
      `const root_item_items_size = root_item.value.length;`,
      `for (let root_item_i = 0; root_item_i < root_item_items_size; root_item_i++) {`,
      `const root_item_item = defineValue(root_item.value[root_item_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: root_item_i,`,
      `  wildCardPath: '*',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(root_item_item);`,
      `if (root_item_item.isDefined && root_item_item.isValid) {`,
      `  root_item_out[root_item_i] = root_item_item.value;`,
      `}`,
      `}`,
      `}`,
      `} else if (root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for array with bail mode disabled', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        allowNull: true,
        isOptional: false,
        bail: false,
        fieldName: '*',
        propertyName: '*',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        each: {
          type: 'literal',
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          bail: false,
          validations: [],
        },
      },
    })

    const compiledOutput = compiler.compile().toString()

    validateCode(compiledOutput)
    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: '',`,
      `  wildCardPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsArray(root_item)) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `const root_item_out = [];`,
      `out = root_item_out;`,
      `const root_item_items_size = root_item.value.length;`,
      `for (let root_item_i = 0; root_item_i < root_item_items_size; root_item_i++) {`,
      `const root_item_item = defineValue(root_item.value[root_item_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: root_item_i,`,
      `  wildCardPath: '*',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(root_item_item);`,
      `if (root_item_item.isDefined && root_item_item.isValid) {`,
      `  root_item_out[root_item_i] = root_item_item.value;`,
      `}`,
      `}`,
      `} else if (root_item.value === null) {`,
      `  out = null;`,
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('compute wildcard path to nested arrays', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'array',
        allowNull: false,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        each: {
          type: 'object',
          fieldName: '*',
          propertyName: '*',
          allowNull: false,
          isOptional: false,
          bail: false,
          validations: [],
          groups: [],
          allowUnknownProperties: false,
          properties: [
            {
              type: 'array',
              fieldName: 'contacts',
              propertyName: 'contacts',
              allowNull: false,
              isOptional: false,
              bail: false,
              each: {
                type: 'literal',
                fieldName: '*',
                propertyName: '*',
                allowNull: false,
                isOptional: false,
                bail: false,
                validations: [],
              },
              validations: [],
            },
          ],
        },
      },
    })

    const compiledOutput = compiler.compile().toString()
    validateCode(compiledOutput)

    assert.assertFormatted(compiledOutput, [
      ...getInitialOutput(),
      `const root_item = defineValue(root, {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: '',`,
      `  wildCardPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item);`,
      `if (ensureIsArray(root_item)) {`,
      `if (root_item.isValid) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isValid) {`,
      `const root_item_out = [];`,
      `out = root_item_out;`,
      `const root_item_items_size = root_item.value.length;`,
      `for (let root_item_i = 0; root_item_i < root_item_items_size; root_item_i++) {`,
      `const root_item_item = defineValue(root_item.value[root_item_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: root_item_i,`,
      `  wildCardPath: '*',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: true,`,
      '});',
      `ensureExists(root_item_item);`,
      `if (ensureIsObject(root_item_item)) {`,
      `const root_item_item_out = {};`,
      `root_item_out[root_item_i] = root_item_item_out;`,
      `const contacts_3 = defineValue(root_item_item.value['contacts'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'contacts',`,
      `  wildCardPath: '*.contacts',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(contacts_3);`,
      `if (ensureIsArray(contacts_3)) {`,
      `const contacts_3_out = [];`,
      `root_item_item_out['contacts'] = contacts_3_out;`,
      `const contacts_3_items_size = contacts_3.value.length;`,
      `for (let contacts_3_i = 0; contacts_3_i < contacts_3_items_size; contacts_3_i++) {`,
      `const contacts_3_item = defineValue(contacts_3.value[contacts_3_i], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: contacts_3_i,`,
      `  wildCardPath: '*.contacts.*',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: contacts_3.value,`,
      `  isArrayMember: true,`,
      `});`,
      `ensureExists(contacts_3_item);`,
      `if (contacts_3_item.isDefined && contacts_3_item.isValid) {`,
      `contacts_3_out[contacts_3_i]  = contacts_3_item.value;`,
      `}`,
      `}`,
      `}`,
      `}`,
      `}`,
      `}`,
      `}`,
      ...getClosingOutput(),
    ])
  })
})
