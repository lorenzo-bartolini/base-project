import { camelize, classify } from "@angular-devkit/core/src/utils/strings";
import ts = require("typescript");

export function generateFormTemplate(interfaceDecl: ts.InterfaceDeclaration): string {
    const className = interfaceDecl.name.text
    const formFields = interfaceDecl.members.map(member => {
        if (ts.isPropertySignature(member) && member.type) {
            const fieldName = member.name.getText();
            const inputType = mapTypeToInput(member.type);

            return `
          <mat-form-field appearance="outline" class="flex-full" >
            <mat-label>{{'${classify(className)}s.${classify(fieldName)}.Label' | translate}}</mat-label>
            <input matInput formControlName="${camelize(fieldName)}" >
          </mat-form-field>
        `;
        }
    }).join('\n');

    return `
    <div class="fxFlex-column">
      <div style="gap: 20px !important; display: flex;
      flex-direction: row">
        ${formFields}
      </div>
    </div>
    `;
}

export function generateFormBuilderTemplate(interfaceDecl: ts.InterfaceDeclaration): string {
  const formFields = interfaceDecl.members.map(member => {
    if (ts.isPropertySignature(member) && member.type) {
      const fieldName = member.name.getText();
      return `
        ${fieldName} : null,
      `
    }
  }).join('\n')

  return `this.form = this.fb.group({
    ${formFields}
   });`
}

function mapTypeToInput(typeNode: ts.TypeNode): string {
    switch (typeNode.kind) {
        case ts.SyntaxKind.StringKeyword:
            return 'text';
        case ts.SyntaxKind.NumberKeyword:
            return 'number';
        case ts.SyntaxKind.BooleanKeyword:
            return 'checkbox';
        default:
            return 'text'; // Fallback type
    }
}