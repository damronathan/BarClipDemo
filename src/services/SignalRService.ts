import { signalRClient } from '../clients/SignalRClient';

export class SignalRService {
  async startConnection(accessToken: string, onTrimSucceeded: (url: string) => void): Promise<void> {
    await signalRClient.startConnection(accessToken, onTrimSucceeded);
  }

  stopConnection(): void {
    signalRClient.stopConnection();
  }
}

export const signalRService = new SignalRService();
