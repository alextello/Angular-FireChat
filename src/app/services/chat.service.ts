import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Mensaje } from "../interfaces/mensaje.interface";
import { map } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {};
  constructor(private afs: AngularFirestore, public authfs: AngularFireAuth) {
    this.authfs.authState.subscribe((user) => {
      console.log("ESTADO DEL USUARIO", user);
      if (!user) {
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  login(proveedor: string) {
    if (proveedor === "google") {
      this.authfs.signInWithPopup(new auth.GoogleAuthProvider());
    } else if (proveedor === "twitter") {
      this.authfs.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }
  logout() {
    this.usuario = {};
    this.authfs.signOut();
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>("chats", (ref) =>
      ref.orderBy("fecha", "desc").limit(5)
    );
    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        this.chats = [];
        for (const mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }
      })
    );
  }

  agregarMensaje(texto: string) {
    // TODO falta el UID del usuario
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      uid: this.usuario.uid,
      mensaje: texto,
      fecha: new Date().getTime(),
    };

    return this.itemsCollection.add(mensaje);
  }
}
