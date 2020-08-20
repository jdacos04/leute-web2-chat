<template>
    <v-layout v-resize ="onResize">
       <v-flex xs12 sm4 lg2 class="usuarios" v-if="mostrarLista"> 
           <v-card>
               <v-toolbar color="asd" card dark dense>
                   <v-toolbar-title class="pixel-font">
                       Usuarios registrados
                   </v-toolbar-title>
               </v-toolbar>
               <v-list>
                   
                   <template v-for="usuario in usuarios" >
                <v-list-tile :value="usuarioSeleccionado && usuarioSeleccionado.uid == usuario.uid"
                 @click="seleccionarUsuario(usuario)" :key="usuario.uid"
                 active-class="usuario-seleccionado">
                    <v-list-tile-avatar size="40">
                        <v-img></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="usuario.nombre" class="pixel-font"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>

                    </v-list-tile-action>


                </v-list-tile>
                           
                    
                   </template>
               </v-list>
           </v-card>
           </v-flex > 
           <v-flex xs12 sm8 lg5 v-if="mostarChat">
               <v-container fill-height class="pa-0 ma0" >
                   <v-layout align-end>
                    <v-flex>
                        <v-card color="#f7faff" :class="mostrarLista ?'ml-3' :'ml-0'">
                       <v-toolbar color="xD" card dense dark>
                           <v-toolbar-title >
                               <v-icon @click="regresar" class="mr-2">arrow_back</v-icon>
                               <v-list-tile-avatar color="white" size="32" >
                                   <v-img></v-img>
                               </v-list-tile-avatar>
                               <span class="ml-3 pixel-font">{{usuarioSeleccionado.nombre}}</span>
                           </v-toolbar-title>
                       </v-toolbar>
                       <v-container ref="chatContainer" class=" pa-0 ma0 scroll-y">
                           <v-card-text :style="'max-heigth:'+height +'px;'">
                               <v-flex xs7 :offset-xs5="item.mid == usuario.mid" class="my-3" v-for="item in chat" :key="item.mid">
                              <v-layout column>
                                   <div class="chat-fecha">{{ convertirFecha(item.fechaEnvio)}}</div>
                               <v-card :color="item.mid != usuario.uid ? 'white':'#c3d9ff'" elevation="1" class="chat-mensaje">
                                   <v-card-text>
                                       <div>{{item.texto}}</div>
                                   </v-card-text>
                               </v-card>
                              </v-layout>
                           </v-flex>
                           </v-card-text>
                       </v-container>
                       <v-card-text>
                           <v-text-field ref="txtMensaje" v-model="mensaje" @keyup.enter="enviarMensaje" :loading="enviandoMensaje" :disabled="enviandoMensaje" solo hide-details label="Escribe un mesaje"></v-text-field>
                       </v-card-text>
                   </v-card>
                    </v-flex>
                   </v-layout>

               </v-container>
           </v-flex>
    </v-layout>
</template>


<script>
import { db } from '@/firebase'
import uuidv4 from 'uuid/dist/v4'


export default {
    props:['usuario'],
    data(){
        return{
            usuarios:[],
            usuarioSeleccionado:null,
            chat:[],
            mensaje:'',
            enviandoMensaje:false,
            cid:null,
            detenetChat:null,
            height: 0
        }
    },
    computed:{
        esMovil(){
            return this.$vuetify.breakpoint.width < 600
        },
        mostrarLista(){
            return this.usuarios && (!this.esMovil || !this.usuarioSeleccionado )

        },
        mostarChat(){
            return this.usuarios && this.usuarioSeleccionado

        }
    },
    created(){
        this.consultarUsuarios()

    },
    
    methods:{
        onResize(){
            this.height= window.innerHeight- 252
        } ,
        convertirFecha(timesStamp){
            return timesStamp.toDate().toISOString().substring(0,16).replace('t','')

        },
        regresar(){
                this.usuarioSeleccionado=null
        },
         enviarNotificacion(mensaje, color){
            this.$emit('onNotificaicon',{mensaje,color})
            },
            generarChatId(uid1,uid2){
                return uid1<uid2 ? `${uid1}-${uid2}`:`${uid2}-${uid1}`
            },

             async seleccionarUsuario(usuario){
                this.cid =this.generarChatId(this.usuario.uid,usuario.uid)
               try{
                   let doc = await db.collection('contactos')
                            .doc(this.cid)
                            .get()

                    if(!doc.exists){
                        await db.collection('contactos')
                            .doc(this.cid)
                            .set({cid: this.cid})

                    }
                    this.usuarioSeleccionado= usuario

                    this.consultarChat()

               }
               catch(error){
                    this.enviarNotificacion('error.Recuperando la infomacion','error')
               }
               
               
               
               

            },
           async consultarChat(){
                   this.chat= []

                  if(this.detenetChat){
                      this.detenetChat()
                  }
                  this.detenetChat =await db
                  .collection('contactos')
                   .doc(this.cid)
                   .collection('chat').orderBy('fechaEnvio')
                   .onSanpshot(sanpshot =>{
                       sanpshot.docChanges().forEach(change =>{//added ,modified, removed
                           if(change.type =='added'){
                               let mensaje = change.doc.data()
                               this.chat.push(mensaje)
                           }
                           this.$nextTick(()=>{
                               if(this.$refs.chatContainer){
                                   this.$refs.chatContainer.scrollTop =1000000
                                   
                               }
                           })
                           
                       })

                   },
                   ()=>{
                       this.enviarNotificacion('ocurrio un error. Recuperando los mensajes','error')
                   })


            },
        async consultarUsuarios(){
            try{
                let docs = await db.collection('usuarios')
                                    .get()
                docs.forEach(doc =>{
                    let usuario = doc.data()
                    if(usuario.uid!== this.usuario.uid){
                        this.usuarios.push(usuario)
                    }
                    
                })
            }
            catch(error){
                this.enviarNotificacion('ocurio un error consultando la lista de usuarios','error')
            }
        },

        async enviarMensaje(){
            if(!this.mensaje|| this.enviandoMensaje)
            {return}

            this.enviandoMensaje= true;

            let mid= uuidv4()

            let mensajeEnviado={
                mid ,
                texto: this.mensaje,
                fechaEnvio:new Date(),
                uid: this.usuario.uid
            }
            
            try{
                await db.collection('contactos')
                    .doc(this.cid)
                    .collection('chat')
                    .doc(mid)
                    .set(mensajeEnviado)
                    console.log(mensajeEnviado)

                    this.mensaje=''
            }
            catch(error){
                this.enviarNotificacion('ocurrio un error enviando el mensaje. intente nuevamente','error')

            }
            finally{
                this.enviandoMensaje=false
                
            }this.$nextTick(()=>{
                this.$refs.txtMensaje.focus()
            })
        }
    }
    
}
</script>




<style>
.usuario-seleccionado{
    background-color:#bad2ff;
}
    .usuarios{
        background-color:dfdfdf;
    }
.chat-mensaje{
    border-radius: 10px;

}
.chat-fecha{
    font-size: 0.8ren;
    margin:3px;
    color:#929292
}
</style>