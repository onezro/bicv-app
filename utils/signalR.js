// signalr-service.js
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
 
let hubConnection: HubConnection;
 
export function initializeSignalRService(url: string) {
  hubConnection = new HubConnectionBuilder()
    .withUrl(url)
    .build();
 
  return hubConnection.start();
}
 
export function subscribeToHubEvents(eventName: string, callback: Function) {
  hubConnection.on(eventName, callback);
}
 
export function sendMessageToHub(methodName: string, ...args: any[]) {
  hubConnection.send(methodName, ...args);
}
 
export function stopSignalRService() {
  hubConnection.stop();
}