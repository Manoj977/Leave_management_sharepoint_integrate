/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { SPComponentLoader } from "@microsoft/sp-loader";
import { setup as pnpSetup } from "@pnp/common";
import App from "./components/App/App";



export interface ILeaveManagementWebPartProps {
  description: string;
}
export default class LeaveManagementWebPart extends BaseClientSideWebPart<ILeaveManagementWebPartProps> {
  public render(): void {
    const element: React.ReactElement = React.createElement(
      App
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

  public async onInit(): Promise<void> { 
    try {
      await SPComponentLoader.loadCss(
        `https://zlendoit.sharepoint.com/sites/production/SiteAssets/LeaveManagement/CSS/LeaveManagement.css?v=1.0`
      );
      
      await super.onInit();
      
      pnpSetup({
        ie11: true, 
        spfxContext: this.context 
      });
    } catch (error) {
      // handle error
      console.error(error);
    }
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
