import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { parseScript } from 'esprima';
import { SecurityRule, VariableEnums, RuleSet, RuleExpression } from './model';
import {
  defaultClientIds,
  defaultMaliciousIPList,
  defaultIpReputationRiskLevels,
  defaultClientTypes,
} from './clientId.model';
import { ruleStrings } from './rules';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  clientIds = defaultClientIds;
  maliciousIPList = defaultMaliciousIPList;
  ipReputationRiskLevels = defaultIpReputationRiskLevels;
  clientTypes = defaultClientTypes;

  fakeUser: SecurityRule = {};
  rules: RuleSet[] = [];

  fakeUserForm = new FormGroup({
    ClientType: new FormControl(
      localStorage.getItem('ClientType'),
      Validators.required
    ),
    IPReputationRiskLevel: new FormControl(
      localStorage.getItem('IPReputationRiskLevel')
    ),
    ASN: new FormControl(localStorage.getItem('ASN')),
    CountryCode: new FormControl(localStorage.getItem('CountryCode')),
    ClientIP: new FormControl(localStorage.getItem('ClientIP'), [
      Validators.required,
      Validators.pattern(
        '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'
      ),
    ]),
    ClientId: new FormControl(Number(localStorage.getItem('ClientId')), [
      Validators.required,
    ]),
    URL: new FormControl(localStorage.getItem('URL')),
    MaliciousIPList: new FormControl(localStorage.getItem('MaliciousIPList')),
  });

  constructor() {}

  onSubmit(form: FormGroup) {
    this.rules = [];

    this.fakeUser = {
      ClientType: form.value.ClientType,
      IPReputationRiskLevel: form.value.IPReputationRiskLevel,
      ASN: form.value.ASN,
      CountryCode: form.value.CountryCode,
      ClientIP: form.value.ClientIP,
      ClientId: form.value.ClientId,
      URL: form.value.URL,
      MaliciousIPList: form.value.MaliciousIPList,
    };
    localStorage.setItem('ClientType', form.value.ClientType);
    localStorage.setItem(
      'IPReputationRiskLevel',
      form.value.IPReputationRiskLevel
    );
    localStorage.setItem('ASN', form.value.ASN);
    localStorage.setItem('CountryCode', form.value.CountryCode);
    localStorage.setItem('ClientIP', form.value.ClientIP);
    // let selectedClientId: ClientId | undefined = this.clientIds.find(cId => cId.id == form.value.ClientId);
    localStorage.setItem('ClientId', form.value.ClientId);
    localStorage.setItem('URL', form.value.URL);
    localStorage.setItem('MaliciousIPList', form.value.MaliciousIPList);

    this.parseRules();
  }

  protected parseRules(): void {
    const separators = ['&', '\\|', '\\(', '\\)'];
    // the result of a rule, for example
    // ClientID == 14 & ClientIP == 55.66.44.22
    // if user's ClientID = 14 and ClientIP = 11.22.33.44
    // then the vvariable ruleBooleanFormat will be 'T & F'
    let ruleBooleanFormat = '';
    // get the rules
    ruleStrings.forEach(ruleString => {
      // create a new RuleSet object to store the rule string, results and expressions
      let ruleSet: RuleSet = new RuleSet();

      // set the rule from ruleString
      ruleSet.rule = ruleString.replace(/;/g, ' ; ');

      // split the rulestring depends on '&,|,(,)' chars
      let ruleExpressions = ruleString.split(
        new RegExp(separators.join('|'), 'g')
      );

      // get one-by-one the rule expressions 'type == value'
      let predicate: string = '';
      let equation: string = '';
      let parenthesis: string = '';
      ruleExpressions.forEach(rule => {
        rule = rule.trim();
        let parameter: string = '';
        let values: string[] = [];
        // console.error(rule);
        let ruleTokens = rule.split(new RegExp(' ', 'g'));
        ruleTokens.forEach(ruleToken => {
          // console.error(ruleToken);
          let isVariable = false;
          let isSpecialChar = false;
          VariableEnums.forEach(variableEnum => {
            if (ruleToken.toLowerCase() === variableEnum.toLowerCase()) {
              parameter = ruleToken;
              isVariable = true;
            }
          });
          if (ruleToken.trim() == '==' || ruleToken.trim() == '!=') {
            isSpecialChar = true;
            equation = ruleToken.trim();
          }
          if (
            ruleToken.trim() == 'contains' ||
            ruleToken.trim() == 'not-contains'
          ) {
            isSpecialChar = true;
            equation = ruleToken.trim();
          }
          if (ruleToken.trim() == '(' || ruleToken.trim() == ')') {
            isSpecialChar = true;
            parenthesis = ruleToken.trim();
          }
          if (!isVariable && !isSpecialChar) {
            values = ruleToken.split(new RegExp(';', 'g'));
          }
        });

        // for array of values, for example 'type == val1;val2;val3'
        let multiplePredicates: any[] = [];
        let operator: string = '';
        Object.keys(this.fakeUser).forEach(key => {
          if (parameter === key) {
            values.forEach(value => {
              if (key === parameter) {
                let bool: boolean;
                // if the type is string then convert it to lower case ready for comparison
                // @ts-expect-error
                if (typeof this.fakeUser[key] === 'string') {
                  // @ts-expect-error
                  this.fakeUser[key] = this.fakeUser[key].toLowerCase();
                  value = value.toLowerCase();
                }
                switch (equation) {
                  case '==':
                    // @ts-expect-error
                    bool = this.fakeUser[key] == value.toLowerCase();
                    operator = '|';
                    break;
                  case '!=':
                    // @ts-expect-error
                    bool = this.fakeUser[key] != value.toLowerCase();
                    operator = '&';
                    break;
                  case 'contains':
                    // @ts-expect-error
                    bool = value.includes(this.fakeUser[key]);
                    operator = '|';
                    break;
                  case 'not-contains':
                    // @ts-expect-error
                    bool = !value.includes(this.fakeUser[key]);
                    operator = '&';
                    break;
                  default:
                    bool = false;
                    operator = '&';
                    break;
                }
                // the ruleExpression and its result (true or false)
                let ruleExpression: RuleExpression = {
                  ruleExpression: parameter + ' ' + equation + ' ' + value,
                  result: bool,
                };
                ruleSet.ruleExpressions.push(ruleExpression);
                multiplePredicates.push(bool);
              }
            });
          }
        });
        // if we have array of values then traspile it to independent expressions
        // for example 'f | t | f'
        predicate = multiplePredicates.join(' ' + operator + ' ');

        // add parenthesis as the ruleString
        if (parenthesis === '(') {
          ruleString += ' ( ';
        } else if (parenthesis === ')') {
          ruleString += ' ) ';
        }
        // replace the expression with the equal/result boolean T|F
        ruleString = ruleString.replace(rule, predicate);
      });
      ruleBooleanFormat = ruleString;
      // set the boolean format fo rule to ruleSet
      ruleSet.boolExpression = ruleBooleanFormat;

      // convert the boolean expression to AST format (based on ChatGPT)
      let ast = parseScript(ruleBooleanFormat);
      // take the result of ruleBooleanFormat
      let result = this.evaluate(ast.body[0]);

      //  the result of rule stored on ruleSet, ready to present it on html
      ruleSet.result = result;
      // add to array of rules
      this.rules.push(ruleSet);
    });
  }

  protected evaluate = (node: any): boolean => {
    if (node.type === 'LogicalExpression' || node.type === 'BinaryExpression') {
      const left = this.evaluate(node.left);
      const right = this.evaluate(node.right);
      switch (node.operator) {
        case '&':
          return left && right;
        case '|':
          return left || right;
        default:
          throw new Error(`Unknown operator: ${node.operator}`);
      }
    } else if (node.type === 'UnaryExpression') {
      return !node.argument;
    } else if (node.type === 'ExpressionStatement') {
      return this.evaluate(node.expression);
    } else if (node.type === 'Literal') {
      return node.value;
    } else if (node.type === 'Identifier') {
      // Assume that the identifier refers to a boolean value in the environment.
      return node.value;
    } else {
      throw new Error(`Unknown node type: ${node.type}`);
    }
  };
}
