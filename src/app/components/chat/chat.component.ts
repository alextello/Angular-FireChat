import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  mensaje = '';
  constructor(public chatService: ChatService) {
     this.chatService.cargarMensajes()
         .subscribe();
   }

  ngOnInit(): void {
  }

  enviarMensaje() {
    if (this.mensaje.length === 0) {
      return;
    } else {
      this.chatService.agregarMensaje(this.mensaje)
          .then(() => {
            console.log('mensaje enviado');
            this.mensaje = '';
          })
          .catch((err) => console.log('No se pudo enviar el mensaje', err));
    }
  }

}
