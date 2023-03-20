import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'LeaveManagementWebPartStrings';

// import Testing from "./components/App/Testing";
// import Profile from "./components/Profile/Profile";
import App from "./components/App/App";
// import About from "./components/About";
// import { SPComponentLoader } from "@microsoft/sp-loader";
import { setup as pnpSetup } from "@pnp/common";
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

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
