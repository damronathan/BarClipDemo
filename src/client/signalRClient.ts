import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

let connection: HubConnection | null = null;

export async function startSignalRConnection(
  accessToken: string,
  onTrimSucceeded: (url: string) => void,
  onClose?: (error?: Error) => void,
  onReconnecting?: (error?: Error) => void,
  onReconnected?: (connectionId?: string) => void
): Promise<void> {
  if (connection && connection.state === HubConnectionState.Connected) {
    return;
  }

  connection = new HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_API_BASE_URL}/videoStatus?access_token=${accessToken}`)
    .withAutomaticReconnect()
    .build();

  connection.on("TrimSucceeded", (url: string) => {
    onTrimSucceeded(url);
  });

  if (onClose) {
    connection.onclose(onClose);
  } else {
    connection.onclose((error) => {
      console.error('SignalR connection closed:', error);
    });
  }

  if (onReconnecting) {
    connection.onreconnecting(onReconnecting);
  } else {
    connection.onreconnecting((error) => {
      console.warn('SignalR reconnecting:', error);
    });
  }

  if (onReconnected) {
    connection.onreconnected(onReconnected);
  } else {
    connection.onreconnected((connectionId) => {
      console.log('SignalR reconnected with connection ID:', connectionId);
    });
  }

  try {
    await connection.start();
    console.log('SignalR connected:', connection.connectionId);
  } catch (error) {
    console.error('SignalR connection failed:', error);
    throw error;
  }
}

export async function stopSignalRConnection(): Promise<void> {
  if (connection && connection.state === HubConnectionState.Connected) {
    await connection.stop();
    connection = null;
  }
}
