<template>
  <v-app>
    <v-app-bar
      app
      color="xD"
      dark
    >
    <v-toolbar-title class="pixel-font">
          LEUTE CHAT
     
    </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout v-if="usuario" align-center justify-end>
        <v-avatar>
          <v-img></v-img>
        </v-avatar>
        <span class="ml-3 pixel-font">{{usuario.nombre}}</span>
      <v-btn class="pixel-font" flat small @click="usuario = null">Exit</v-btn>
      </v-layout>

  
    </v-app-bar>

    <v-main>
     <v-container fluid fill-height class="fondo">
       <login v-if="!usuario" @onNotificaicon="mostrarNotificacion" @onIngresar="ingresar"/>
       <chat v-else @onNotificaicon="mostrarNotificacion" :usuario="usuario"/>
     </v-container>
    </v-main>
    <v-snackbar v-model="notificacion.visible" :color="notificacion.color" multi-line top :timeout="6000" dark>
      <span>{{notificacion.mensaje}}</span>
      <v-btn color="white" flat @click="notificacion.visible= false" >
        Cerrar
      </v-btn>

    </v-snackbar>
    <v-footer color="xD" dark>
      <v-layout>

      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import login from './components/login';
import chat from './components/chat';

export default {
  name: 'App',

  components: {
    login,
    chat
  },

  data(){
    return{
      usuario:null,
      notificacion:{
        mensaje:'',
        color:'info',
        visible:false

      }
    }
  },
  methods:{
    ingresar(usuario){
      this.usuario=usuario

    },
    mostrarNotificacion(notificacion){
      this.notificacion.mensaje = notificacion.mensaje
      this.notificacion.color = notificacion.color
      this.notificacion.visible =true
    }
  }
    

};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
.pixel-font{
  font-family: 'Press Start 2P', cursive !important; 
}
.fondo{
  background-color:#f1f1f1 ;
}
</style>


