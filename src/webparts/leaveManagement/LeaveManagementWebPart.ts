import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'LeaveManagementWebPartStrings';
import LeaveManagement from './components/LeaveManagement';


export interface ILeaveManagementWebPartProps {
  description: string;
}
export default class LeaveManagementWebPart extends BaseClientSideWebPart<ILeaveManagementWebPartProps> {



  public render(): void {
    const element: React.ReactElement = React.createElement(
      LeaveManagement,


    );

    ReactDom.render(element, this.domElement);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }


  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }
  public onInit(): Promise<void> {
    //     SPComponentLoader.loadCss(
    //   `${this.context.pageContext.site.absoluteUrl}/SiteAssets/CSS/LeaveManagement.css?v=1.0`
    // );

    return super.onInit().then(() => {
      pnpSetup({
        ie11: true,
        spfxContext: this.context
      });
    });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
