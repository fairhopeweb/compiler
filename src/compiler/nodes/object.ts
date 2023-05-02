/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Compiler } from '../main.js'
import type { CompilerBuffer } from '../buffer.js'
import { defineObjectGuard } from '../../scripts/object/guard.js'
import { defineFieldVariables } from '../../scripts/field/variables.js'
import { defineIsValidGuard } from '../../scripts/field/is_valid_guard.js'
import { defineFieldNullOutput } from '../../scripts/field/null_output.js'
import { defineFieldValidations } from '../../scripts/field/validations.js'
import { defineObjectInitialOutput } from '../../scripts/object/initial_output.js'
import { defineMoveProperties } from '../../scripts/object/move_unknown_properties.js'
import { defineFieldExistenceValidations } from '../../scripts/field/existence_validations.js'

import type {
  CompilerField,
  CompilerParent,
  ObjectNode,
  CompilerUnionParent,
  ObjectGroupNode,
} from '../../types.js'
import { defineConditionalGuard } from '../../scripts/union/conditional_guard.js'

/**
 * Compiles an object schema node to JS string output.
 */
export class ObjectNodeCompiler {
  #node: ObjectNode
  #buffer: CompilerBuffer
  #compiler: Compiler
  #parent?: CompilerParent
  #union?: CompilerUnionParent

  constructor(
    node: ObjectNode,
    buffer: CompilerBuffer,
    compiler: Compiler,
    parent?: CompilerParent,
    union?: CompilerUnionParent
  ) {
    this.#node = node
    this.#buffer = buffer
    this.#compiler = compiler
    this.#parent = parent
    this.#union = union
  }

  /**
   * Returns known field names for the object
   */
  #getFieldNames(): string[] {
    let fieldNames = this.#node.properties.map((child) => child.fieldName)
    const groupsFieldNames = this.#node.groups.flatMap((group) => this.#getGroupFieldNames(group))
    return fieldNames.concat(groupsFieldNames)
  }

  /**
   * Returns field names of a group.
   */
  #getGroupFieldNames(group: ObjectGroupNode): string[] {
    return group.conditions.flatMap((condition) => {
      if (condition.schema.type === 'sub_object') {
        return condition.schema.children.map((child) => {
          return child.fieldName
        })
      } else {
        return this.#getGroupFieldNames(condition.schema)
      }
    })
  }

  /**
   * Creates field for the current node. Handles checks needed for union
   * child.
   */
  #createField() {
    /**
     * Do not increment the variables counter when a direct
     * child of a union.
     */
    if (!this.#union) {
      this.#compiler.variablesCounter++
    }

    const field = this.#compiler.createFieldFor(this.#node, this.#parent)
    if (this.#union) {
      field.variableName = this.#union.variableName
    }

    return field
  }

  /**
   * Compiles object children to JS output
   */
  #compileObjectChildren(field: CompilerField) {
    const buffer = this.#buffer.child()

    this.#node.properties.forEach((child) => {
      this.#compiler.compileNode(child, buffer, {
        type: 'object',
        fieldPathExpression: field.fieldPathExpression,
        outputExpression: field.outputExpression,
        variableName: field.variableName,
      })
    })

    return buffer.toString()
  }

  /**
   * Compiles object groups with conditions to JS output.
   */
  #compileObjectGroups(field: CompilerField) {
    const buffer = this.#buffer.child()
    this.#node.groups.forEach((group) => {
      this.#compileObjectGroup(group, buffer, field)
    })
    return buffer.toString()
  }

  /**
   * Compiles an object groups recursively
   */
  #compileObjectGroup(group: ObjectGroupNode, buffer: CompilerBuffer, field: CompilerField) {
    group.conditions.forEach((condition, index) => {
      const guardBuffer = buffer.child()

      if (condition.schema.type === 'group') {
        this.#compileObjectGroup(condition.schema, guardBuffer, field)
      } else {
        condition.schema.children.forEach((child) => {
          this.#compiler.compileNode(child, guardBuffer, {
            type: 'object',
            fieldPathExpression: field.fieldPathExpression,
            outputExpression: field.outputExpression,
            variableName: field.variableName,
          })
        })
      }

      buffer.writeStatement(
        defineConditionalGuard({
          variableName: field.variableName,
          conditional: index === 0 ? 'if' : 'else if',
          conditionalFnRefId: condition.conditionalFnRefId,
          guardedCodeSnippet: guardBuffer.toString(),
        })
      )
    })
  }

  compile() {
    const field = this.#createField()

    /**
     * Step 1: Define the field variable when field is not a child
     * of a union.
     */
    if (!this.#union) {
      this.#buffer.writeStatement(
        defineFieldVariables({
          variableName: field.variableName,
          valueExpression: field.valueExpression,
          fieldNameExpression: field.fieldNameExpression,
          fieldPathExpression: field.fieldPathExpression,
          parentValueExpression: field.parentVariableName,
          isArrayMember: field.isArrayMember,
        })
      )
    }

    /**
     * Step 2: Define code to validate the existence of field.
     */
    this.#buffer.writeStatement(
      defineFieldExistenceValidations({
        allowNull: this.#node.allowNull,
        isOptional: this.#node.isOptional,
        variableName: field.variableName,
      })
    )

    /**
     * Wrapping initialization of output + object children validations
     * validation inside `if object field is valid` block.
     *
     * Pre step: 3
     */
    const isObjectValidBlock = defineIsValidGuard({
      variableName: field.variableName,
      bail: this.#node.bail,
      guardedCodeSnippet: `${defineObjectInitialOutput({
        outputExpression: field.outputExpression,
        outputValueExpression: '{}',
      })}${this.#buffer.newLine}${this.#compileObjectChildren(field)}${
        this.#buffer.newLine
      }${this.#compileObjectGroups(field)}${this.#buffer.newLine}${defineMoveProperties({
        variableName: field.variableName,
        outputExpression: field.outputExpression,
        allowUnknownProperties: this.#node.allowUnknownProperties,
        fieldsToIgnore: this.#node.allowUnknownProperties ? this.#getFieldNames() : [],
      })}`,
    })

    /**
     * Wrapping field validations + "isObjectValidBlock" inside
     * `if value is object` check.
     *
     * Pre step: 3
     */
    const isValueAnObject = defineObjectGuard({
      variableName: field.variableName,
      guardedCodeSnippet: `${defineFieldValidations({
        variableName: field.variableName,
        validations: this.#node.validations,
        bail: this.#node.bail,
        dropMissingCheck: true,
      })}${isObjectValidBlock}`,
    })

    /**
     * Step 3: Define `if value is an object` block and `else if value is null`
     * block.
     */
    this.#buffer.writeStatement(
      `${isValueAnObject}${this.#buffer.newLine}${defineFieldNullOutput({
        variableName: field.variableName,
        allowNull: this.#node.allowNull,
        outputExpression: field.outputExpression,
        conditional: 'else if',
      })}`
    )
  }
}
