import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { apiClient } from './ApiClient';

/**
 * Centralized SignalR client for all real-time communication
 */
export class SignalRClient {
  private connection: HubConnection | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiClient.getBaseUrl();
  }

  /**
   * Starts a SignalR connection with authentication
   * @param accessToken - The access token for authentication
   * @param onTrimSucceeded - Callback when video trimming succeeds
   * @returns Promise<void>
   */
  async startConnection(accessToken: string, onTrimSucceeded: (url: string) => void): Promise<void> {
    console.log('🔌 Starting SignalR connection setup...');
    
    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(`${this.baseUrl}/videoStatus?access_token=${accessToken}`)
        .withAutomaticReconnect()
        .build();

      console.log('🏗️ HubConnectionBuilder created successfully');

      // Set up event handlers
      this.setupEventHandlers(onTrimSucceeded);

      console.log('🚀 Attempting to start SignalR connection...');
      await this.connection.start();
      console.log('✅ SignalR connected successfully!');
      console.log('🔗 Connection ID:', this.connection.connectionId);
      console.log('🔗 Connection state:', this.connection.state);
      
    } catch (error) {
      console.error('❌ SignalR connection failed:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      throw error;
    }
  }

  /**
   * Sets up all SignalR event handlers
   * @param onTrimSucceeded - Callback when video trimming succeeds
   */
  private setupEventHandlers(onTrimSucceeded: (url: string) => void): void {
    if (!this.connection) {
      throw new Error('Connection not initialized');
    }

    // Handle successful video trimming
    this.connection.on("TrimSucceeded", (url: string) => {
      console.log("🎉 TrimSucceeded SAS URL received:", url);
      onTrimSucceeded(url);
    });

    // Handle connection close
    this.connection.onclose((error) => {
      console.log('❌ SignalR connection closed:', error);
    });

    // Handle reconnection attempts
    this.connection.onreconnecting((error) => {
      console.log('🔄 SignalR reconnecting:', error);
    });

    // Handle successful reconnection
    this.connection.onreconnected((connectionId) => {
      console.log('✅ SignalR reconnected with connection ID:', connectionId);
    });
  }

  /**
   * Stops the SignalR connection
   */
  stopConnection(): void {
    if (this.connection) {
      console.log('🛑 Stopping SignalR connection...');
      this.connection.stop();
      this.connection = null;
      console.log('✅ SignalR connection stopped');
    }
  }

  /**
   * Gets the current connection state
   * @returns string - The connection state
   */
  getConnectionState(): string {
    return this.connection?.state || 'Disconnected';
  }

  /**
   * Gets the current connection ID
   * @returns string | undefined - The connection ID
   */
  getConnectionId(): string | undefined {
    return this.connection?.connectionId || undefined;
  }

  /**
   * Checks if the connection is active
   * @returns boolean - True if connected
   */
  isConnected(): boolean {
    return this.connection?.state === 'Connected';
  }

  /**
   * Gets the base URL used for SignalR connections
   * @returns string - The base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export a singleton instance
export const signalRClient = new SignalRClient();
