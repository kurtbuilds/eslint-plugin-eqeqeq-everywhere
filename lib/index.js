/**
 * @fileoverview change double to triple equals more aggressively
 * @author Kurt Wolf
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

module.exports.rules = {
    "eqeqeq": {
        meta: {
            type: "suggestion",
            docs: {
                description: "fix all double equals",
                category: "Possible Errors",
                recommended: true,
                url: "https://eslint.org/docs/rules/no-extra-semi"
            },
            fixable: "code",
            messages: {
                "unexpected": "Expected '{{expectedOperator}}' and instead saw '{{actualOperator}}'."
            },
            schema: []
        },
        create: function (context) {
            return {
                BinaryExpression: (node) => {
                    if (["==", "!="].includes(node.operator)) {
                        const sourceCode = context.getSourceCode();
                        const operatorToken = sourceCode.getFirstTokenBetween(
                            node.left,
                            node.right,
                            token => token.value === node.operator
                        );
                        const expectedOperator = {
                            "==": "===",
                            "!=": "!=="
                        }[node.operator];
                        context.report({
                            node,
                            loc: operatorToken.loc,
                            messageId: "unexpected",
                            data: {expectedOperator, actualOperator: node.operator},
                            fix(fixer) {
                                return fixer.replaceText(operatorToken, expectedOperator);
                            }
                        });
                    }
                }
            };
        }
    }
}
