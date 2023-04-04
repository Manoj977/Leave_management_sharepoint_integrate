// import {
//     SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions
//   } from '@microsoft/sp-http';

// try {
//     const requestUrl = `https://zlendoit.sharepoint.com/sites/ZlendoTools/Lists/HolidayList/AllItems.aspx`;
//     const response = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
//     if (response.ok) {
//       const responseJSON = await response.json();
//       console.log(responseJSON);
//     }
//   } catch (e) {
//     console.log("error", e);
//   }