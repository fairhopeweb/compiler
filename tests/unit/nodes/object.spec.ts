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

test.group('Object node', () => {
  test('create JS output for an object node', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
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
        properties: [],
        allowUnknownProperties: false,
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
      `  fieldPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isValid) {`,
      `out = {};`,
      '}',
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for a nullable object node', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'profile',
        propertyName: 'userProfile',
        validations: [
          {
            implicit: false,
            isAsync: false,
            ruleFnId: 'ref://2',
          },
        ],
        properties: [],
        allowUnknownProperties: false,
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
      `  fieldPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isValid) {`,
      `out = {};`,
      '}',
      `}`,
      'else if(root_item.value === null) {',
      `  out = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output without object validations', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        validations: [],
        properties: [],
        allowUnknownProperties: false,
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
      `  fieldPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `out = {};`,
      '}',
      `}`,
      'else if(root_item.value === null) {',
      `  out = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output for object children', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'profile',
        propertyName: 'userProfile',
        validations: [],
        properties: [
          {
            type: 'literal',
            allowNull: false,
            isOptional: false,
            bail: true,
            fieldName: 'username',
            propertyName: 'username',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
        allowUnknownProperties: false,
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
      `  fieldPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `out = {};`,
      `const username_2 = defineValue(root_item.value['username'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'username',`,
      `  fieldPath: 'username',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(username_2);`,
      `if (username_2.isValid && username_2.isDefined) {`,
      `  refs['ref://2'].validator(username_2.value, refs['ref://2'].options, username_2);`,
      `}`,
      `if (username_2.isDefined && username_2.isValid) {`,
      `  out['username'] = username_2.value;`,
      `}`,
      '}',
      `}`,
      'else if(root_item.value === null) {',
      `  out = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output for object with bail mode disabled', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
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
        properties: [],
        allowUnknownProperties: false,
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
      `  fieldPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `out = {};`,
      `}`,
      'else if(root_item.value === null) {',
      `  out = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output for node object with unknownProperties allowed', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        groups: [],
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
        properties: [],
        allowUnknownProperties: true,
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
      `  fieldPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureExists(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `  refs['ref://2'].validator(root_item.value, refs['ref://2'].options, root_item);`,
      `}`,
      `if (root_item.isValid) {`,
      `out = {};`,
      `moveProperties(root_item.value, out, []);`,
      '}',
      `}`,
      ...getClosingOutput(),
    ])
  })

  test('create JS output for object groups', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: '*',
        propertyName: '*',
        validations: [],
        properties: [
          {
            type: 'literal',
            allowNull: false,
            isOptional: false,
            bail: true,
            fieldName: 'password',
            propertyName: 'password',
            validations: [],
          },
        ],
        groups: [
          {
            type: 'group',
            conditions: [
              {
                conditionalFnRefId: 'ref://1',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'username',
                      propertyName: 'username',
                      validations: [],
                    },
                  ],
                },
              },
              {
                conditionalFnRefId: 'ref://2',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'email',
                      propertyName: 'email',
                      validations: [],
                    },
                  ],
                },
              },
            ],
          },
        ],
        allowUnknownProperties: false,
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
      `  fieldPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `out = {};`,
      `const password_2 = defineValue(root_item.value['password'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'password',`,
      `  fieldPath: 'password',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(password_2);`,
      `if (password_2.isDefined && password_2.isValid) {`,
      `  out['password'] = password_2.value;`,
      `}`,
      `if (refs['ref://1'](root_item.value, root_item)) {`,
      `  const username_3 = defineValue(root_item.value['username'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'username',`,
      `  fieldPath: 'username',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(username_3);`,
      `if (username_3.isDefined && username_3.isValid) {`,
      `  out['username'] = username_3.value;`,
      `}`,
      `}`,
      `else if (refs['ref://2'](root_item.value, root_item)) {`,
      `  const email_4 = defineValue(root_item.value['email'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'email',`,
      `  fieldPath: 'email',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(email_4);`,
      `if (email_4.isDefined && email_4.isValid) {`,
      `  out['email'] = email_4.value;`,
      `}`,
      `}`,
      '}',
      `}`,
      'else if(root_item.value === null) {',
      `  out = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output for multiple object groups', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'login',
        propertyName: 'login',
        validations: [],
        properties: [
          {
            type: 'literal',
            allowNull: false,
            isOptional: false,
            bail: true,
            fieldName: 'password',
            propertyName: 'password',
            validations: [],
          },
        ],
        groups: [
          {
            type: 'group',
            conditions: [
              {
                conditionalFnRefId: 'ref://1',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'username',
                      propertyName: 'username',
                      validations: [],
                    },
                  ],
                },
              },
              {
                conditionalFnRefId: 'ref://2',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'email',
                      propertyName: 'email',
                      validations: [],
                    },
                  ],
                },
              },
            ],
          },
          {
            type: 'group',
            conditions: [
              {
                conditionalFnRefId: 'ref://3',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'oauth_token',
                      propertyName: 'oauthToken',
                      validations: [],
                    },
                  ],
                },
              },
              {
                conditionalFnRefId: 'ref://4',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'secret_key',
                      propertyName: 'secretKey',
                      validations: [],
                    },
                  ],
                },
              },
            ],
          },
        ],
        allowUnknownProperties: false,
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
      `  fieldPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `out = {};`,
      `const password_2 = defineValue(root_item.value['password'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'password',`,
      `  fieldPath: 'password',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(password_2);`,
      `if (password_2.isDefined && password_2.isValid) {`,
      `  out['password'] = password_2.value;`,
      `}`,
      `if (refs['ref://1'](root_item.value, root_item)) {`,
      `  const username_3 = defineValue(root_item.value['username'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'username',`,
      `  fieldPath: 'username',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(username_3);`,
      `if (username_3.isDefined && username_3.isValid) {`,
      `  out['username'] = username_3.value;`,
      `}`,
      `}`,
      `else if (refs['ref://2'](root_item.value, root_item)) {`,
      `  const email_4 = defineValue(root_item.value['email'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'email',`,
      `  fieldPath: 'email',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(email_4);`,
      `if (email_4.isDefined && email_4.isValid) {`,
      `  out['email'] = email_4.value;`,
      `}`,
      `}`,
      `if (refs['ref://3'](root_item.value, root_item)) {`,
      `  const oauthToken_5 = defineValue(root_item.value['oauth_token'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'oauth_token',`,
      `  fieldPath: 'oauth_token',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(oauthToken_5);`,
      `if (oauthToken_5.isDefined && oauthToken_5.isValid) {`,
      `  out['oauthToken'] = oauthToken_5.value;`,
      `}`,
      `}`,
      `else if (refs['ref://4'](root_item.value, root_item)) {`,
      `  const secretKey_6 = defineValue(root_item.value['secret_key'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'secret_key',`,
      `  fieldPath: 'secret_key',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(secretKey_6);`,
      `if (secretKey_6.isDefined && secretKey_6.isValid) {`,
      `  out['secretKey'] = secretKey_6.value;`,
      `}`,
      `}`,
      '}',
      `}`,
      'else if(root_item.value === null) {',
      `  out = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('create JS output for nested object groups', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'login',
        propertyName: 'login',
        validations: [],
        properties: [
          {
            type: 'literal',
            allowNull: false,
            isOptional: false,
            bail: true,
            fieldName: 'password',
            propertyName: 'password',
            validations: [],
          },
        ],
        groups: [
          {
            type: 'group',
            conditions: [
              {
                conditionalFnRefId: 'ref://1',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'username',
                      propertyName: 'username',
                      validations: [],
                    },
                  ],
                },
              },
              {
                conditionalFnRefId: 'ref://2',
                schema: {
                  type: 'group',
                  conditions: [
                    {
                      conditionalFnRefId: 'ref://3',
                      schema: {
                        type: 'sub_object',
                        children: [
                          {
                            type: 'literal',
                            allowNull: false,
                            isOptional: false,
                            bail: true,
                            fieldName: 'hotmail',
                            propertyName: 'hotmail',
                            validations: [],
                          },
                        ],
                      },
                    },
                    {
                      conditionalFnRefId: 'ref://4',
                      schema: {
                        type: 'sub_object',
                        children: [
                          {
                            type: 'literal',
                            allowNull: false,
                            isOptional: false,
                            bail: true,
                            fieldName: 'email',
                            propertyName: 'email',
                            validations: [],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
        allowUnknownProperties: false,
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
      `  fieldPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `out = {};`,
      `const password_2 = defineValue(root_item.value['password'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'password',`,
      `  fieldPath: 'password',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(password_2);`,
      `if (password_2.isDefined && password_2.isValid) {`,
      `  out['password'] = password_2.value;`,
      `}`,
      `if (refs['ref://1'](root_item.value, root_item)) {`,
      `  const username_3 = defineValue(root_item.value['username'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'username',`,
      `  fieldPath: 'username',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(username_3);`,
      `if (username_3.isDefined && username_3.isValid) {`,
      `  out['username'] = username_3.value;`,
      `}`,
      `}`,
      `else if (refs['ref://2'](root_item.value, root_item)) {`,
      `if (refs['ref://3'](root_item.value, root_item)) {`,
      `  const hotmail_4 = defineValue(root_item.value['hotmail'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'hotmail',`,
      `  fieldPath: 'hotmail',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(hotmail_4);`,
      `if (hotmail_4.isDefined && hotmail_4.isValid) {`,
      `  out['hotmail'] = hotmail_4.value;`,
      `}`,
      `}`,
      `else if (refs['ref://4'](root_item.value, root_item)) {`,
      `  const email_5 = defineValue(root_item.value['email'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'email',`,
      `  fieldPath: 'email',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(email_5);`,
      `if (email_5.isDefined && email_5.isValid) {`,
      `  out['email'] = email_5.value;`,
      `}`,
      `}`,
      `}`,
      '}',
      `}`,
      'else if(root_item.value === null) {',
      `  out = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })

  test('define else block for conditions', async ({ assert }) => {
    const compiler = new Compiler({
      type: 'root',
      schema: {
        type: 'object',
        allowNull: true,
        isOptional: false,
        bail: true,
        fieldName: 'login',
        propertyName: 'login',
        validations: [],
        properties: [
          {
            type: 'literal',
            allowNull: false,
            isOptional: false,
            bail: true,
            fieldName: 'password',
            propertyName: 'password',
            validations: [],
          },
        ],
        groups: [
          {
            type: 'group',
            elseConditionalFnRefId: 'ref://10',
            conditions: [
              {
                conditionalFnRefId: 'ref://1',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'username',
                      propertyName: 'username',
                      validations: [],
                    },
                  ],
                },
              },
              {
                conditionalFnRefId: 'ref://2',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'email',
                      propertyName: 'email',
                      validations: [],
                    },
                  ],
                },
              },
            ],
          },
          {
            type: 'group',
            elseConditionalFnRefId: 'ref://11',
            conditions: [
              {
                conditionalFnRefId: 'ref://3',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'oauth_token',
                      propertyName: 'oauthToken',
                      validations: [],
                    },
                  ],
                },
              },
              {
                conditionalFnRefId: 'ref://4',
                schema: {
                  type: 'sub_object',
                  children: [
                    {
                      type: 'literal',
                      allowNull: false,
                      isOptional: false,
                      bail: true,
                      fieldName: 'secret_key',
                      propertyName: 'secretKey',
                      validations: [],
                    },
                  ],
                },
              },
            ],
          },
        ],
        allowUnknownProperties: false,
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
      `  fieldPath: '',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root,`,
      `  isArrayMember: false,`,
      '});',
      `ensureIsDefined(root_item);`,
      `if (ensureIsObject(root_item)) {`,
      `if (root_item.isValid) {`,
      `out = {};`,
      `const password_2 = defineValue(root_item.value['password'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'password',`,
      `  fieldPath: 'password',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(password_2);`,
      `if (password_2.isDefined && password_2.isValid) {`,
      `  out['password'] = password_2.value;`,
      `}`,
      `if (refs['ref://1'](root_item.value, root_item)) {`,
      `  const username_3 = defineValue(root_item.value['username'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'username',`,
      `  fieldPath: 'username',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(username_3);`,
      `if (username_3.isDefined && username_3.isValid) {`,
      `  out['username'] = username_3.value;`,
      `}`,
      `}`,
      `else if (refs['ref://2'](root_item.value, root_item)) {`,
      `  const email_4 = defineValue(root_item.value['email'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'email',`,
      `  fieldPath: 'email',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(email_4);`,
      `if (email_4.isDefined && email_4.isValid) {`,
      `  out['email'] = email_4.value;`,
      `}`,
      `} else {`,
      `refs['ref://10'](root_item.value, root_item);`,
      `}`,
      `if (refs['ref://3'](root_item.value, root_item)) {`,
      `  const oauthToken_5 = defineValue(root_item.value['oauth_token'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'oauth_token',`,
      `  fieldPath: 'oauth_token',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(oauthToken_5);`,
      `if (oauthToken_5.isDefined && oauthToken_5.isValid) {`,
      `  out['oauthToken'] = oauthToken_5.value;`,
      `}`,
      `}`,
      `else if (refs['ref://4'](root_item.value, root_item)) {`,
      `  const secretKey_6 = defineValue(root_item.value['secret_key'], {`,
      `  data: root,`,
      `  meta: meta,`,
      `  fieldName: 'secret_key',`,
      `  fieldPath: 'secret_key',`,
      `  mutate: defineValue,`,
      `  report: report,`,
      `  isValid: true,`,
      `  parent: root_item.value,`,
      `  isArrayMember: false,`,
      `});`,
      `ensureExists(secretKey_6);`,
      `if (secretKey_6.isDefined && secretKey_6.isValid) {`,
      `  out['secretKey'] = secretKey_6.value;`,
      `}`,
      `} else {`,
      `refs['ref://11'](root_item.value, root_item);`,
      `}`,
      '}',
      `}`,
      'else if(root_item.value === null) {',
      `  out = null;`,
      '}',
      ...getClosingOutput(),
    ])
  })
})
