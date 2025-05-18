import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SessionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // מפה לשמירת מזהה משתמש ו-socket id
  private userMap = new Map<string, string>();  // userId -> socketId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // שמירת זיהוי משתמש אם קיים ב-handshake
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userMap.set(userId, client.id);
      console.log(`User ${userId} mapped to socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // הסרת המיפוי של המשתמש שהתנתק
    for (const [userId, socketId] of this.userMap.entries()) {
      if (socketId === client.id) {
        this.userMap.delete(userId);
        console.log(`Removed mapping for user ${userId}`);
        break;
      }
    }
  }

  @SubscribeMessage('selectSong')
  handleSelectSong(@MessageBody() data: any) {
    // ברגע שהאדמין בוחר שיר — משדר לכל המשתמשים
    this.server.emit('songSelected', data);
  }

  @SubscribeMessage('quitSession')
  handleQuitSession() {
    // שולח לכולם הודעה לחזור למסך הראשי
    this.server.emit('sessionEnded');
  }

  @SubscribeMessage('kickAllUsers')
  handleKickAllUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { adminId: string }
  ) {
    console.log(`Admin ${data.adminId} is kicking all users from session`);
    
    // Get admin socket ID
    const adminSocketId = this.userMap.get(data.adminId) || client.id;
    
    // Emit kick event to all clients except the admin
    client.broadcast.emit('kickedFromSession', {
      message: 'You have been kicked from the session by the admin',
      timestamp: new Date().toISOString()
    });
    
    console.log(`Kicked all users except admin (socket: ${adminSocketId})`);
    
    // Send confirmation to admin
    this.server.to(adminSocketId).emit('usersKicked', {
      success: true,
      message: 'All users have been kicked from the session',
      timestamp: new Date().toISOString()
    });
  }
}
