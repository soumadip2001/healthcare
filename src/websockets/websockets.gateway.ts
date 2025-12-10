import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true }) // Enable CORS if needed
export class WebsocketsGateway {
  @WebSocketServer()
  server: Server;

  // Emit to a specific patient
  notifyPatient(patientid: string, message: any) {
    this.server.to(patientid).emit('appointmentStatusChanged', message);
  }

  // Emit to a specific doctor
  notifyDoctor(doctorid: string, message: any) {
    this.server.to(doctorid).emit('newAppointment', message);
  }

  // Optional: Listen for client joining a room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: { userId: string }) {
    return this.server.sockets.sockets.get(data.userId)?.join(data.userId);
  }
}
